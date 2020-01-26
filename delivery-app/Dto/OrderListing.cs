using System;
using System.Linq.Expressions;
using DeliveryApp.Data.Model;

namespace DeliveryApp.Dto
{
    public class DispatchOrderListing
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public DateTime OrderedAt { get; set; }
        public string RestaurantName { get; set; }

        public static Expression<Func<Order, DispatchOrderListing>> MappingExpression = o => new DispatchOrderListing
        {
            Id = o.Id,
            Username = o.Username,
            OrderedAt = o.OrderedAt,
            RestaurantName = o.Restaurant.Name,
        };
    }

    public class OrderListing : DispatchOrderListing
    {
        public int RestaurantId { get; set; }
        public DateTime? CompletedAt { get; set; }
        public byte? Rating { get; set; }

        public static new Expression<Func<Order, OrderListing>> MappingExpression = o => new OrderListing
        {
            Id = o.Id,
            Username = o.Username,
            OrderedAt = o.OrderedAt,
            RestaurantId = o.Restaurant.Id,
            RestaurantName = o.Restaurant.Name,
            CompletedAt = o.CompletedAt,
            Rating = o.Rating == null
                ? (byte?)null
                : o.Rating.Score
        };
    }
}