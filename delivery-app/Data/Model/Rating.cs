using System;

namespace DeliveryApp.Data.Model
{
    public class Rating
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public DateTime CreatedAt { get; set; }
        public byte Score { get; set; }
        public int RestaurantId { get; set; }
        public Restaurant Restaurant { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; }
    }
}