using DeliveryApp.Data.Model;
using Microsoft.EntityFrameworkCore;

namespace DeliveryApp.Data
{
    public class DeliveryDbContext : DbContext
    {

        public DeliveryDbContext(DbContextOptions<DeliveryDbContext> options)
            : base(options)
        { }


        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<Dish> Dishes { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Rating> Ratings { get; set; }
        public DbSet<RestaurantTag> RestaurantTags { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<RestaurantTag>()
                .HasKey(t => new { t.RestaurantId, t.TagId });

            modelBuilder.Entity<RestaurantTag>()
                .HasOne(rt => rt.Restaurant)
                .WithMany(r => r.RestaurantTags)
                .HasForeignKey(rt => rt.RestaurantId);

            modelBuilder.Entity<RestaurantTag>()
                .HasOne(rt => rt.Tag)
                .WithMany(t => t.RestaurantTags)
                .HasForeignKey(rt => rt.TagId);
        }
    }
}