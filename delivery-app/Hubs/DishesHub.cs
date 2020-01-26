using System.Linq;
using System.Threading.Tasks;
using DeliveryApp.Data;
using DeliveryApp.Dto;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace DeliveryApp.Hubs
{
    public class DishesHub : Hub
    {
        private readonly DeliveryDbContext _context;

        public DishesHub(DeliveryDbContext context)
        {
            _context = context;
        }

        [HubMethodName("GetRestaurant")]
        public async Task<RestaurantWithDishes> GetRestaurantAsync(int id)
        {
            return await _context.Restaurants
                .Select(r => new RestaurantWithDishes
                {
                    Id = r.Id,
                    Name = r.Name,
                    Dishes = r.Dishes.Select(d => new DishDto
                    {
                        Id = d.Id,
                        Name = d.Name,
                        Description = d.Description,
                        Price = d.Price,
                    }),
                })
                .SingleAsync(r => r.Id == id);
        }
    }
}