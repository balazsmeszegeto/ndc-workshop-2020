using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace DeliveryApp.IdentityServer
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseUrls("http://*:8192");
                    webBuilder.UseStartup<Startup>();
                });
    }
}
