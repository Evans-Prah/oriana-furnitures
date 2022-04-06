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

        public async Task<List<ReviewInfo>> GetProductReviews(string productUuid) => await _dbHelper.GetProductReviews(productUuid);

        public async Task<TotalRatingInfo?> GetTotalProductReviews(string productUuid) => await _dbHelper.GetTotalProductReviews(productUuid);


    }
}
