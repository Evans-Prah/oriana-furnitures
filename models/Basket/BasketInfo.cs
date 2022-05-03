
namespace models.Basket
{
    public class BasketInfo
    {
        public int BasketId { get; set; }
        public string BuyerId { get; set; }
        public List<BasketItems>? Items  { get; set; }
    }
}
