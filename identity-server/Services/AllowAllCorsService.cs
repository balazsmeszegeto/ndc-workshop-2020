using System.Threading.Tasks;
using IdentityServer4.Services;

namespace DeliveryApp.IdentityServer.Services
{
    internal class AllowAllCorsService : ICorsPolicyService
    {
        public Task<bool> IsOriginAllowedAsync(string origin)
        {
            return Task.FromResult(true);
        }
    }
}