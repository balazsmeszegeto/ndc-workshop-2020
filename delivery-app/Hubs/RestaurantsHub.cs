using DeliveryApp.Data;
using DeliveryApp.Dto;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DeliveryApp.Hubs
{
    public interface IRestaurantsHubClient
    {
        Task Updated(IEnumerable<RestaurantListing> restaurant);
    }
    public class RestaurantsHub : Hub<IRestaurantsHubClient>
    {
        private readonly DeliveryDbContext _context;

        public RestaurantsHub(DeliveryDbContext context)
        {
            _context = context;
        }

        [HubMethodName("GetRestaurants")]
        public async Task<IEnumerable<RestaurantListing>> GetRestaurantsAsync(IEnumerable<int> tagIds)
        {
            if (tagIds == null || !tagIds.Any())
            {
                return await _context.Restaurants
                    .OrderBy(r => r.Distance)
                    .Select(RestaurantListing.MappingExpression)
                    .ToListAsync();
            }

            return await _context.Restaurants
                .Where(r => r.RestaurantTags.Any(rt => tagIds.Contains(rt.TagId)))
                .OrderBy(r => r.Distance)
                .Select(RestaurantListing.MappingExpression)
                .ToListAsync();
        }

        [HubMethodName("GetTags")]
        public async Task<IEnumerable<object>> GetTagsAsync()
        {
            return await _context.Tags
                .Select(t => new { Id = t.Id, Name = t.Name })
                .ToListAsync();
        }
    }
}