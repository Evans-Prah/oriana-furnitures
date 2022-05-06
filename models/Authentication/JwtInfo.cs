namespace models.Authentication
{
    public class JwtInfo
    {
        public string Token { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
