using models.Product;

namespace helpers.DbHelper
{
    public interface IDbHelper
    {
        Task<List<ProductsInfo>> GetProducts();
        Task<ProductInfo?> GetProduct(string productUuid);
        Task<List<ReviewInfo>> GetProductReviews(string productUuid);
        Task<TotalRatingInfo?> GetTotalProductReviews(string productUuid);
    }
}