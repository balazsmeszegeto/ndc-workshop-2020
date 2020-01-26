using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using IdentityServer4.Services;
using IdentityModel;

namespace DeliveryApp.IdentityServer.Controllers
{
    [AllowAnonymous]
    public class AccountController : Controller
    {
        private readonly IIdentityServerInteractionService _service;

        public AccountController(IIdentityServerInteractionService service)
        {
            _service = service;
        }


        [Route("/Account/Login"), HttpGet]
        public IActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }


        [Route("/Account/LoginPostBack"), HttpPost, ValidateAntiForgeryToken]
        public async Task<IActionResult> LoginPostBack(LoginPostbackModel model, string returnUrl)
        {
            await HttpContext.SignInAsync(model.Username, new[]
            {
                new Claim(JwtClaimTypes.Name, string.IsNullOrWhiteSpace(model.DisplayName) ? model.Username : model.DisplayName),
                new Claim(Config.DispatchClaimType, model.Dispatch ? "true" : "false", ClaimValueTypes.Boolean)
            });
            return Redirect(returnUrl);
        }

        [Route("/Account/Logout"), HttpGet]
        public async Task<IActionResult> Logout(string logoutId)
        {
            await HttpContext.SignOutAsync();
            HttpContext.User = new ClaimsPrincipal(new ClaimsIdentity());

            var context = await _service.GetLogoutContextAsync(logoutId);
            var vm = new LogoutModel
            {
                PostLogoutUri = context.PostLogoutRedirectUri,
                ClientName = context.ClientName,
            };
            return View("LoggedOut", vm);
        }
    }
}