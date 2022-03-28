using models.Product;

namespace helpers.DbHelper
{
    public interface IDbHelper
    {
        Task<List<ProductsInfo>> GetProducts();
        Task<ProductInfo?> GetProduct(string productUuid);
    }
}