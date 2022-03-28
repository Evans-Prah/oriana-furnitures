using models.Product;

namespace helpers.ProductsHelper
{
    public interface IProductsHelper
    {
        Task<ProductInfo?> GetProduct(string productUuid);
        Task<List<ProductsInfo>> GetProducts();
    }
}