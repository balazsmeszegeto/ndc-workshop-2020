using DeliveryApp.Data.Model;

namespace DeliveryApp.Data.Seeding
{
    internal static class DataSource
    {
        internal static RestaurantInit[] Data = new[]
        {
            new RestaurantInit
            {
                Name = "Mardin",
                Distance = 500,
                Tags = new[] { "Middle Eastern", "Homemade", "Meat" },
                Dishes = new[]
                {
                    new Dish { Name = "Shawarmaroll", Description = "with salad", Price = 79 },
                    new Dish { Name = "Sada", Description = "with rice, salad, sauce og naan bread", Price = 99 },
                    new Dish { Name = "Chicken nuggets", Description = "with fries and salad", Price = 129 },
                    new Dish { Name = "Shish kebab", Description = "with naan bread and salad", Price = 129 },
                }
            },
            new RestaurantInit
            {
                Name = "Subway Storgata",
                Distance = 560,
                Tags = new[] { "International", "Sandwich", "Meat", "Salad", "Vegetables" },
                Dishes = new[]
                {
                    new Dish { Name = "Ham", Price = 49 },
                    new Dish { Name = "Bacon, Lettuce & Tomato", Price = 54 },
                    new Dish { Name = "Turkey & Ham", Price = 54 },
                    new Dish { Name = "Steak & Cheese", Price = 69 },
                }
            },
            new RestaurantInit
            {
                Name = "Joe & The Juice Storgata",
                Distance = 600,
                Tags = new[] { "International", "Healthy", "Fruit", "Sandwich", "Vegetables" },
                Dishes = new[]
                {
                    new Dish { Name = "Joe's Green Mile", Description = "juice of broccoli, spinach, avocado, lemon and apple", Price = 92 },
                    new Dish { Name = "Joe's ID", Description = "juice of curly kale, broccoli, spinach, lemon and cucumber", Price = 92 },
                    new Dish { Name = "Green Shield", Description = "juice of curly kale, broccoli, cucumber, spinach and apple", Price = 92 },
                    new Dish { Name = "Herb tonic", Description = "juice of turmeric, ginger, pineapple, bell pepper and apple", Price = 92 },
                }
            },
            new RestaurantInit
            {
                Name = "Miss Gin Løkka",
                Distance = 730,
                Tags = new[] { "Vegetarian", "Vietnamese", "Asian", "Homemade" },
                Dishes = new[]
                {
                    new Dish { Name = "Bánh Mì Xá Xíu", Description = "Vietnamese sandwich with grilled pork", Price = 99 },
                    new Dish { Name = "Nem Nướng", Description = "2 pcs. Vietnamese fresh springrolls with grilled pork meatballs", Price = 95 },
                    new Dish { Name = "Gỏi Cuốn", Description = "2 pcs. Vietnamese fresh springrolls with scampi, pork", Price = 90 },
                    new Dish { Name = "Bánh Mì Gà Xã ớt", Description = "Vietnamese sandwich with grilled lemongrass chili chicken", Price = 99 },
                }
            }
        };
    }
}