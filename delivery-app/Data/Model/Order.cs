using System;

namespace DeliveryApp.Data.Model
{
    public class Order
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public DateTime OrderedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public int RestaurantId { get; set; }
        public Restaurant Restaurant { get; set; }
        public Rating Rating { get; set; }
        
        //Order items are omitted
    }
}