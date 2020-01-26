using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DeliveryApp.Data;
using DeliveryApp.Data.Model;
using DeliveryApp.Dto;
using DeliveryApp.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace DeliveryApp.Hubs
{
    public interface IUserHubClient
    {
        Task Updated(IEnumerable<OrderListing> orders);
        Task Created(IEnumerable<OrderListing> orders);
    }

    [Authorize]
    public class UserHub : Hub<IUserHubClient>
    {
        private readonly DeliveryDbContext _context;
        private readonly UpdateService _updateService;

        public UserHub(DeliveryDbContext context, UpdateService updateService)
        {
            _context = context;
            _updateService = updateService;
        }

        [HubMethodName("CreateOrders")]
        public async Task CreateOrdersAsync(IEnumerable<int> restaurantIds)
        {
            var existingRestaurantIds = await _context.Restaurants
                .Where(r => restaurantIds.Contains(r.Id))
                .Select(r => r.Id)
                .ToListAsync();

            var ordersToAdd = existingRestaurantIds
                .Select(id => new Order
                {
                    Username = Context.User.GetSub(),
                    OrderedAt = DateTime.Now.Truncate(),
                    CompletedAt = null,
                    RestaurantId = id,
                })
                .ToList();

            await _context.Orders.AddRangeAsync(ordersToAdd);
            await _context.SaveChangesAsync();

            _updateService.SendRestaurantsUpdated(existingRestaurantIds).Forget();

            var newOrderIds = ordersToAdd.Select(o => o.Id).ToList();
            _updateService.SendDispatchPendingUpdate(newOrderIds).Forget();
            _updateService.SendUserOrdersCreated(newOrderIds, Context.User.GetSub()).Forget();
        }

        [HubMethodName("GetOrders")]
        public async Task<IEnumerable<OrderListing>> GetOrders()
        {
            return await _context.Orders
                .Where(o => o.Username == Context.User.GetSub())
                .OrderByDescending(o => o.OrderedAt)
                .Take(100) //arbitrary limit
                .Select(OrderListing.MappingExpression)
                .ToListAsync();
        }


        [HubMethodName("RateOrder")]
        public async Task RateOrderAsync(int orderId, byte score)
        {
            var order = await _context.Orders.SingleAsync(o => o.Id == orderId);
            await _context.Ratings.AddAsync(new Rating
            {
                Username = Context.User.GetSub(),
                CreatedAt = DateTime.Now.Truncate(),
                Score = score,
                RestaurantId = order.RestaurantId,
                OrderId = orderId
            });
            await _context.SaveChangesAsync();

            _updateService.SendUserOrdersUpdated(new[] { orderId }, Context.User.GetSub()).Forget();
            _updateService.SendRestaurantsUpdated(new [] { order.RestaurantId }).Forget();
        }

    }

}