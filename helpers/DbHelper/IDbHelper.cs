using models.Basket;
using models.Product;

namespace helpers.DbHelper
{
    public interface IDbHelper
    {
        Task<List<ProductsInfo>> GetProducts();
        Task<ProductInfo?> GetProduct(string productUuid);
        Task<List<ReviewInfo>> GetProductReviews(string productUuid);
        Task<TotalRatingInfo?> GetTotalProductReviews(string productUuid);
        Task<BasketInfo> GetBasket(string? buyerId);
        Task<AddBasketDbResponse> AddItemToBasket(string productUuid, int quantity, string buyerId);
        Task<BasketDbResponse> RemoveItemFromBasket(string productUuid, int quantity, string buyerId);
       
    }
}