namespace models.Authentication
{
    public class AccountUserDetails
    {
        public string ResponseMessage { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string AccountRole { get; set; }
        public JwtInfo Token { get; set; }
    }
}
