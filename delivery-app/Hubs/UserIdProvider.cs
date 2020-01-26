using System.Linq;
using IdentityModel;
using Microsoft.AspNetCore.SignalR;

namespace DeliveryApp.Hubs
{
    public class UserIdProvider : IUserIdProvider
    {
        public string GetUserId(HubConnectionContext connection)
        {
            return connection.User?.Claims.FirstOrDefault(c => c.Type == JwtClaimTypes.Subject)?.Value;
        }
    }
}