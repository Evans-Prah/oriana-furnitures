using helpers.DbHelper;
using models.Product;

namespace helpers.ProductsHelper
{
    public class ProductsHelper : IProductsHelper
    {
        private readonly IDbHelper _dbHelper;

        public ProductsHelper(IDbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        public async Task<List<ProductsInfo>> GetProducts() => await _dbHelper.GetProducts();

        public async Task<ProductInfo?> GetProduct(string productUuid) => await _dbHelper.GetProduct(productUuid);
    }
}
