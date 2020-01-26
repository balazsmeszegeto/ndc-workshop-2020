using System.Collections.Generic;

namespace DeliveryApp.Data.Model
{
    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<RestaurantTag> RestaurantTags { get; set; }
    }
}