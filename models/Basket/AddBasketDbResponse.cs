namespace models.Basket
{
    public class AddBasketDbResponse
    {
        public string? Message { get; set; }
        public int ResponseCode { get; set; }
        public List<BasketItems?> Items { get; set; }
    }
}
