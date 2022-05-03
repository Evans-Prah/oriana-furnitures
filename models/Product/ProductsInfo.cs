namespace models.Product
{
    public class ProductsInfo
    {
        public int ProductId { get; set; }
        public string ProductUuid { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public long Price { get; set; }
        public string? PictureUrl { get; set; }
        public string Category { get; set; }
        public string Brand { get; set; }
        public int QuantityInStock { get; set; }
       
    }
}
