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
        Task<BasketDbResponse> AddItemToBasket(string productUuid, int quantity, string buyerId);
        Task<List<BasketItemsInfo?>> GetBasket(string? buyerId);
        Task<BasketDbResponse> RemoveItemFromBasket(string productUuid, int quantity, string buyerId);
    }
}