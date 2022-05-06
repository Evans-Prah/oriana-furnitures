namespace models.Authentication
{
    public class AccountLoginInfo
    {
        public string ResponseMessage { get; set; }
        public string AccountUuid { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string AccountRole { get; set; }
        public DateTime? LastLogin { get; set; }
        public JwtInfo Token { get; set; }
    }
}
