using System.Collections.Generic;

namespace DeliveryApp.Dto
{
    public class DishDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
    }

    public class RestaurantWithDishes
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<DishDto> Dishes { get; set; }
    }
}