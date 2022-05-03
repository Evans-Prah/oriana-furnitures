using helpers.DbHelper;
using models;
using models.Basket;
using Newtonsoft.Json;
using System.Text;

namespace helpers.BasketHelper
{
    public class BasketHelper : IBasketHelper
    {
        private readonly IDbHelper _dbHelper;

        public BasketHelper(IDbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        public async Task<BasketInfo> GetBasket(string buyerId) => await _dbHelper.GetBasket(buyerId);

        public async Task<HelpersResponse> AddItemToBasket(int productId, int quantity, string buyerId, StringBuilder logs)
        {
            logs.AppendLine("-- AddItemToBasket");
            logs.AppendLine($"Request Payload: {JsonConvert.SerializeObject(new { productId, quantity, buyerId })}");

            if (productId < 1) return new HelpersResponse { Successful = false, ResponseMessage = "Product is required" };

            if (quantity < 1) return new HelpersResponse { Successful = false, ResponseMessage = "Quantity should be at least 1" };

            var dbResponse = await _dbHelper.AddItemToBasket(productId, quantity, buyerId);
            logs.AppendLine($"DB Response: {JsonConvert.SerializeObject(dbResponse)}");

            if (!string.IsNullOrWhiteSpace(dbResponse.Message) && dbResponse.ResponseCode == 100) return new HelpersResponse
            {
                Successful = false,
                ResponseMessage = dbResponse.Message,
                Data = new AddBasketDbResponse { ResponseCode = dbResponse.ResponseCode }
            };
            if (!string.IsNullOrWhiteSpace(dbResponse.Message) && dbResponse.ResponseCode == 105) return new HelpersResponse
            {
                Successful = true,
                ResponseMessage = dbResponse.Message,
                Data = new AddBasketDbResponse
                {
                    ResponseCode = dbResponse.ResponseCode,
                    Items = dbResponse.Items,
                }
            };

            return new HelpersResponse
            {
                Successful = true,
                ResponseMessage = "Item added to cart successfully",
                Data = new AddBasketDbResponse
                {
                    ResponseCode = dbResponse.ResponseCode,
                    Items = dbResponse.Items,
                }
            };
        }

        public async Task<HelpersResponse> RemoveItemFromBasket(int productId, int quantity, string buyerId, StringBuilder logs)
        {
            logs.AppendLine("-- RemoveItemFromBasket");
            logs.AppendLine($"Request Payload: {JsonConvert.SerializeObject(new { productId, quantity, buyerId })}");

            if (productId < 1) return new HelpersResponse { Successful = false, ResponseMessage = "Product is required" };

            if (quantity < 1) return new HelpersResponse { Successful = false, ResponseMessage = "Quantity should be at least 1" };

            var dbResponse = await _dbHelper.RemoveItemFromBasket(productId, quantity, buyerId);
            logs.AppendLine($"DB Response: {JsonConvert.SerializeObject(dbResponse)}");

            if (!string.IsNullOrWhiteSpace(dbResponse.Message) && dbResponse.ResponseCode == 400) return new HelpersResponse { Successful = false, ResponseMessage = dbResponse.Message };
            if (!string.IsNullOrWhiteSpace(dbResponse.Message) && dbResponse.ResponseCode == 401) return new HelpersResponse { Successful = false, ResponseMessage = dbResponse.Message };
            if (!string.IsNullOrWhiteSpace(dbResponse.Message) && dbResponse.ResponseCode == 402) return new HelpersResponse { Successful = false, ResponseMessage = dbResponse.Message };
            if (!string.IsNullOrWhiteSpace(dbResponse.Message) && dbResponse.ResponseCode == 404) return new HelpersResponse { Successful = false, ResponseMessage = dbResponse.Message };

            return new HelpersResponse { Successful = true, ResponseMessage = dbResponse.Message };
        }
    }
}
