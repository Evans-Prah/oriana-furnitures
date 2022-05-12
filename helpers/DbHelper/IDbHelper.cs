using models.Authentication;
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
        Task<AddBasketDbResponse> AddItemToBasket(int productId, int quantity, string buyerId);
        Task<BasketDbResponse> RemoveItemFromBasket(int productId, int quantity, string buyerId);
        Task<string> CreateUserAccount(string accountUuid, string username, string password, string email, string phoneNumber);
        Task<AccountLoginInfo> ValidateAccountLogin(string username, string password);
        Task<AccountLoginInfo> GetUserDetails(string username);
    }
}