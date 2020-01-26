using System;
using System.Linq;
using DeliveryApp.Data.Model;
using DeliveryApp.Extensions;
using Microsoft.EntityFrameworkCore;

namespace DeliveryApp.Data.Seeding
{
    internal class RestaurantInit : Restaurant
    {
        public string[] Tags { get; set; }
    }

    internal static class SeedData
    {
        public static void Initialize(DbContextOptions<DeliveryDbContext> options)
        {
            using (var context = new DeliveryDbContext(options))
            {
                context.Database.EnsureCreated();

                if (context.Restaurants.Any())
                {
                    return;
                }

                var restaurants = DataSource.Data
                    .Select((r, i) =>
                    {
                        r.Id = i + 1;
                        return r;
                    })
                    .ToList();

                var tags = restaurants
                    .SelectMany(r => r.Tags)
                    .Distinct()
                    .Select((t, i) => new Tag { Id = i + 1, Name = t })
                    .ToList();

                var restaurantTags = restaurants
                    .SelectMany(r => r.Tags.Select(t => new RestaurantTag
                    {
                        RestaurantId = r.Id,
                        TagId = tags.Single(tag => tag.Name == t).Id
                    }))
                    .ToList();

                var dishes = restaurants.SelectMany(r => r.Dishes.Select(d => new Dish
                    {
                        Name = d.Name,
                        Description = d.Description,
                        Price = d.Price,
                        RestaurantId = r.Id
                    }))
                    .Select((d, i) =>
                    {
                        d.Id = i + 1;
                        return d;
                    })
                    .ToList();

                var random = new Random();
                var orders = restaurants
                    .SelectMany(restaurant =>
                    {
                        var currentTime = DateTime.Now;
                        var completedOrders = Enumerable
                            .Repeat(0, random.Next(100))
                            .Select(_ => 
                            {
                                var orderedAt = currentTime.AddDays(random.NextDouble() * -60);
                                return new Order
                                {
                                    Username = GetRandomUsername(),
                                    OrderedAt = orderedAt.Truncate(),
                                    CompletedAt = orderedAt.AddMinutes(random.NextDouble() * 30).Truncate(),
                                    RestaurantId = restaurant.Id,
                                };
                            });

                        var pendingOrders = Enumerable
                            .Repeat(0, random.Next(3))
                            .Select(_ => new Order
                            {
                                Username = GetRandomUsername(),
                                OrderedAt = currentTime.AddMinutes(-random.Next(31)).Truncate(),
                                CompletedAt = null,
                                RestaurantId = restaurant.Id,
                            });
                        return completedOrders.Concat(pendingOrders);
                    })
                    .Select((o, i) =>
                    {
                        o.Id = i + 1;
                        return o;
                    })
                    .ToList();

                var ratings = orders
                    .Where(o => o.CompletedAt != null && random.Next(5) == 0)
                    .Select(o =>
                    {
                        var currentTime = DateTime.Now;
                        return new Rating
                            {
                                Username = GetRandomUsername(),
                                CreatedAt = o.CompletedAt.Value.AddHours(random.NextDouble() * 24).Truncate(),
                                Score = (byte)random.Next(6),
                                RestaurantId = o.RestaurantId,
                                OrderId = o.Id
                            };
                    })
                    .Select((r, i) =>
                    {
                        r.Id = i + 1;
                        return r;
                    })
                    .ToList();

                context.Restaurants.AddRange(restaurants.Select(ri => new Restaurant { Id = ri.Id, Name = ri.Name, Distance = ri.Distance }));
                context.Tags.AddRange(tags);
                context.RestaurantTags.AddRange(restaurantTags);
                context.Dishes.AddRange(dishes);
                context.Orders.AddRange(orders);
                context.Ratings.AddRange(ratings);
                context.SaveChanges();
            }
        }

        private static readonly string[] Usernames = new[] { "joe", "adam", "david", "kyle", "martha", "karen", "elisabeth", "julianne" };
        private static string GetRandomUsername()
        {
            var random = new Random();
            return Usernames[random.Next(Usernames.Length)];
        }
    }
}