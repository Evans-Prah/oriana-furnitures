namespace models
{
    public class HelpersResponse
    {
        public bool Successful { get; set; }
        public string ResponseMessage { get; set; }
        public dynamic Data { get; set; }
    }
}
