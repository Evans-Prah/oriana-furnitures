using models;
using models.Basket;
using System.Text;

namespace helpers.BasketHelper
{
    public interface IBasketHelper
    {
        Task<HelpersResponse> AddItemToBasket(int productId, int quantity, string buyerId, StringBuilder logs);
        Task<BasketInfo> GetBasket(string buyerId);
        Task<HelpersResponse> RemoveItemFromBasket(int productId, int quantity, string buyerId, StringBuilder logs);
    }
}