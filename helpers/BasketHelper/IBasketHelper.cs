using models;
using models.Basket;
using System.Text;

namespace helpers.BasketHelper
{
    public interface IBasketHelper
    {
        Task<HelpersResponse> AddItemToBasket(string productUuid, int quantity, string buyerId, StringBuilder logs);
        Task<List<BasketItemsInfo?>> GetBasket(string buyerId);
        Task<HelpersResponse> RemoveItemFromBasket(string productUuid, int quantity, string buyerId, StringBuilder logs);
    }
}