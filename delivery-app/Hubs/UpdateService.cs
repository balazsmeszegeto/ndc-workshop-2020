using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DeliveryApp.Data;
using DeliveryApp.Dto;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace DeliveryApp.Hubs
{
    public class UpdateService
    {
        private readonly DeliveryDbContext _context;
        private readonly IHubContext<DispatchHub, IDispatchHubClient> _dispatchHubContext;
        private readonly IHubContext<RestaurantsHub, IRestaurantsHubClient> _restaurantsHubContext;
        private readonly IHubContext<UserHub, IUserHubClient> _userHubContext;

        public UpdateService(DeliveryDbContext context, IHubContext<DispatchHub, IDispatchHubClient> dispatchHubContext, IHubContext<RestaurantsHub, IRestaurantsHubClient> restaurantsHubContext, IHubContext<UserHub, IUserHubClient> userHubContext)
        {
            _context = context;
            _dispatchHubContext = dispatchHubContext;
            _restaurantsHubContext = restaurantsHubContext;
            _userHubContext = userHubContext;
        }

        public async Task SendDispatchPendingUpdate(IEnumerable<int> orderIds)
        {
            var newOrders = await _context.Orders
                .Where(o => orderIds.Contains(o.Id))
                .OrderByDescending(o => o.OrderedAt)
                .Select(DispatchOrderListing.MappingExpression)
                .ToListAsync();
            await _dispatchHubContext.Clients.All.PendingOrdersCreated(newOrders);
        }

        public async Task SendDispatchOrderCompleted(int orderId)
        {
            await _dispatchHubContext.Clients.All.OrderCompleted(orderId);
        }

        public async Task SendUserOrdersUpdated(IEnumerable<int> orderIds, string userId)
        {
            var newOrders = await GetUserOrders(orderIds);
            await _userHubContext.Clients.User(userId).Updated(newOrders);
        }

        public async Task SendUserOrdersCreated(IEnumerable<int> orderIds, string userId)
        {
            var newOrders = await GetUserOrders(orderIds);
            await _userHubContext.Clients.User(userId).Created(newOrders);
        }

        private async Task<IEnumerable<OrderListing>> GetUserOrders(IEnumerable<int> orderIds)
        {
            return await _context.Orders
                .Where(o => orderIds.Contains(o.Id))
                .OrderByDescending(o => o.OrderedAt)
                .Select(OrderListing.MappingExpression)
                .ToListAsync();
        }

        public async Task SendRestaurantsUpdated(IEnumerable<int> restaurantIds)
        {
            var updatedRestaurantListings = await _context.Restaurants
                .Where(r => restaurantIds.Contains(r.Id))
                .Select(RestaurantListing.MappingExpression)
                .ToListAsync();

            await _restaurantsHubContext.Clients.All.Updated(updatedRestaurantListings);
        }
    }
}