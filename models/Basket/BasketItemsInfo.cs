namespace models.Basket
{
    public class BasketItemsInfo
    {
        public int BasketItemId { get; set; }
        public string BuyerId { get; set; }
        public string Product { get; set; }
        public string Brand { get; set; }
        public string Category { get; set; }
        public long Price { get; set; }
        public int Quantity { get; set; }
        public string PictureUrl { get; set; }
    }
}
