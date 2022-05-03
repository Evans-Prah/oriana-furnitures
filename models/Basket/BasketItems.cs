namespace models.Basket
{
    public class BasketItems
    {
        public string ProductUuid { get; set; }
        public string Product { get; set; }
        public string Brand { get; set; }
        public string Category { get; set; }
        public long Price { get; set; }
        public int Quantity { get; set; }
        public string PictureUrl { get; set; }
    }
}
