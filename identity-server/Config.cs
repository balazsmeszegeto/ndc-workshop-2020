using IdentityModel;
using IdentityServer4;
using IdentityServer4.Models;
using IdentityServer4.Test;
using System.Collections.Generic;
using System.Security.Claims;

namespace DeliveryApp.IdentityServer
{
    public static class Config
    {
        public static IEnumerable<Client> Clients => new[]
        {
            new Client
            {
                ClientId = "delivery.spa",
                ClientName = "Delivery SPA",

                RequireClientSecret = false,
                RequireConsent = false,

                RedirectUris = { "http://localhost:8686/" },
                PostLogoutRedirectUris = { "http://localhost:8686/" },

                AllowedGrantTypes = GrantTypes.Code,
                AllowedScopes = { IdentityServerConstants.StandardScopes.OpenId, "delivery-app-id", "delivery-app-api" },

                AlwaysIncludeUserClaimsInIdToken = true,
                AllowOfflineAccess = true,
                RefreshTokenUsage = TokenUsage.ReUse
            },
        };

        internal const string DispatchClaimType = "dispatch";
        internal static ICollection<string> DeliveryAppClaims = new[] { JwtClaimTypes.Name, DispatchClaimType };

        public static IEnumerable<IdentityResource> IdentityResources => new IdentityResource[]
        {
            new IdentityResources.OpenId(),
            new IdentityResource
            {
                Name = "delivery-app-id",
                UserClaims = DeliveryAppClaims,
            },
        };

        public static IEnumerable<ApiResource> ApiResources => new[]
        {

            new ApiResource
            {
                Name = "delivery-app-api",
                UserClaims = DeliveryAppClaims,
                Scopes = new List<Scope>()
                {
                    new Scope("delivery-app-api"),
                }
            },
        };
    }
}