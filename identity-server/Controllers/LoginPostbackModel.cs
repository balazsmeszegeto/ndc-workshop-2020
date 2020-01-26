namespace DeliveryApp.IdentityServer.Controllers
{
    public class LoginPostbackModel
    {
        public string Username { get; set; }
        public bool Dispatch { get; set; }
        public string DisplayName { get; set; }
    }
}