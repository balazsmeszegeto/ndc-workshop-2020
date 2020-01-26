using System.Collections.Generic;

namespace DeliveryApp.Data.Model
{
    public class Restaurant
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Distance { get; set; }
        public ICollection<RestaurantTag> RestaurantTags { get; set; }

        public ICollection<Dish> Dishes { get; set; }
        public ICollection<Rating> Ratings { get; set; }
        public ICollection<Order> Orders { get; set; }
    }
}