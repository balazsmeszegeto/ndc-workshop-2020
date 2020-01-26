using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;

namespace DeliveryApp.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetSub(this ClaimsPrincipal principal)
        {
            return principal.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;
        }
    }
}