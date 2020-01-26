using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using DeliveryApp.Data.Model;

namespace DeliveryApp.Dto
{
    public class RestaurantListing
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<string> Tags { get; set; }
        public int Distance { get; set; }
        public int RatingSum { get; set; }
        public int RatingCount { get; set; }
        public int PendingOrders { get; set; }
        public int CompletedOrders { get; set; }

        public static readonly Expression<Func<Restaurant, RestaurantListing>> MappingExpression = (Restaurant r) =>
            new RestaurantListing
            {
                Id = r.Id,
                Name = r.Name,
                Tags = r.RestaurantTags.Select(rt => rt.Tag.Name),
                Distance = r.Distance,
                PendingOrders = r.Orders.Where(o => o.CompletedAt == null).Count(),
                CompletedOrders = r.Orders.Where(o => o.CompletedAt != null).Count(),
                RatingSum = r.Ratings.Sum(rating => rating.Score),
                RatingCount = r.Ratings.Count,
            };
    }
}