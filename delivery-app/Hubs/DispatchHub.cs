using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;
using DeliveryApp.Data;
using DeliveryApp.Dto;
using DeliveryApp.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace DeliveryApp.Hubs
{
    public interface IDispatchHubClient
    {
        Task PendingOrdersCreated(IEnumerable<DispatchOrderListing> orders);
        Task OrderCompleted(int orderId);
    }

    [Authorize(Policy = "Dispatch")]
    public class DispatchHub : Hub<IDispatchHubClient>
    {
        private readonly DeliveryDbContext _context;
        private readonly UpdateService _updateService;

        public DispatchHub(DeliveryDbContext context, UpdateService updateService)
        {
            _context = context;
            _updateService = updateService;
        }

        [HubMethodName("GetPendingOrders")]
        public async Task<IEnumerable<DispatchOrderListing>> GetPendingOrdersAsync(int? restaurantId)
        {
            var orders = restaurantId == null
                ? _context.Orders.Where(o => o.CompletedAt == null)
                : _context.Orders.Where(o => o.CompletedAt == null && o.RestaurantId == restaurantId.Value);

            return await orders
                .OrderBy(o => o.OrderedAt)
                .Select(DispatchOrderListing.MappingExpression)
                .ToListAsync();
        }

        [HubMethodName("CompleteOrder")]
        public async Task CompleteOrderAsync(int orderId)
        {
            var order = await _context.Orders.SingleAsync(o => o.Id == orderId);
            if (order.CompletedAt != null)
            {
                throw new AlreadyCompletedOrderException(orderId);
            }

            order.CompletedAt = DateTime.Now.Truncate();
            await _context.SaveChangesAsync();

            _updateService.SendDispatchOrderCompleted(orderId).Forget();
            _updateService.SendRestaurantsUpdated(new[] { order.RestaurantId }).Forget();
            _updateService.SendUserOrdersUpdated(new[] { orderId }, order.Username ).Forget();
        }

        public ChannelReader<IEnumerable<OrderListing>> StreamOrders(int? restaurantId, CancellationToken cancellationToken)
        {
            var channel = Channel.CreateUnbounded<IEnumerable<OrderListing>>();
            WriteOrdersToStream(channel.Writer, restaurantId, cancellationToken).Forget();
            return channel.Reader;
        }

        private async Task WriteOrdersToStream(ChannelWriter<IEnumerable<OrderListing>> writer, int? restaurantId, CancellationToken cancellationToken)
        {
            Exception localException = null;
            try
            {
                await WriteOrdersToStreamThrows(writer, restaurantId, cancellationToken);
            }
            catch (Exception ex)
            {
                localException = ex;
            }

            writer.Complete(localException);
        }

        private async Task WriteOrdersToStreamThrows(ChannelWriter<IEnumerable<OrderListing>> writer, int? restaurantId, CancellationToken cancellationToken)
        {
            const int ChunkSize = 10;
            //const int Delay = 100;
            var orders = (restaurantId == null
                ? _context.Orders
                : _context.Orders.Where(o => o.RestaurantId == restaurantId.Value))
            .OrderBy(o => o.OrderedAt);

            var orderCount = await orders.CountAsync();
            for (var skip = 0; skip <= orderCount; skip += ChunkSize)
            {
                var chunk = await orders
                    .Skip(skip)
                    .Take(ChunkSize)
                    .Select(OrderListing.MappingExpression)
                    .ToListAsync();

                await writer.WriteAsync(chunk, cancellationToken);

                //await Task.Delay(Delay, cancellationToken);
            }

        }
    }

    public class AlreadyCompletedOrderException : Exception
    {
        public AlreadyCompletedOrderException(int orderId)
        {
            OrderId = orderId;
        }
        public int OrderId { get; }
    }
}