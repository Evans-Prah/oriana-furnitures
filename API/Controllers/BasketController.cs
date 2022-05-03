using helpers.BasketHelper;
using helpers.FileLogger;
using Microsoft.AspNetCore.Mvc;
using models;
using models.Basket;
using models.Payload;
using System.Text;
using System.Text.Json;

namespace API.Controllers
{
    [Route("api/basket")]
    [ApiController]
    public class BasketController : ControllerBase
    {
        private readonly IBasketHelper _basketHelper;
        private readonly IFileLogger _logger;

        public BasketController(IBasketHelper basketHelper, IFileLogger logger)
        {
            _basketHelper = basketHelper;
            _logger = logger;
        }

        [HttpGet("[action]")]
        public async Task<ApiResponse> GetBasket()
        {
            try
            {
                var buyerId = Request.Cookies["buyerId"];

                if (buyerId == null) buyerId = Guid.NewGuid().ToString();

                var basket = await _basketHelper.GetBasket(buyerId);

                if (basket == null) return new ApiResponse { Success = false, ResponseMessage = "Basket does not exist" };
                
                return new ApiResponse { Success = true,  ResponseMessage = "Basket fecthed successfully",  Data = basket };
            }
            catch (Exception e)
            {
                _logger.LogError(e);
                return new ApiResponse { Success = false, ResponseMessage = "A system error occured while processing request, try again later." };
            }
        }

        

        [HttpPost("[action]")]
        public async Task<ApiResponse> AddItemToBasket(string productUuid, int quantity)
        {
            StringBuilder logs = new();
            logs.AppendLine($"Request @ {DateTime.Now}, Path: {Request.Path}");

            try
            {
                var buyerId = Request.Cookies["buyerId"];

                if (buyerId == null) buyerId = Guid.NewGuid().ToString();

                var process = await _basketHelper.AddItemToBasket(productUuid, quantity, buyerId, logs);

                var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
                Response.Cookies.Append("buyerId", buyerId, cookieOptions);

                if (!process.Successful) return new ApiResponse { Success = process.Successful, ResponseMessage = process.ResponseMessage, Data = process.Data };

                return new ApiResponse { Success = true, ResponseMessage = process.ResponseMessage, Data = process.Data };
            }
            catch (Exception e)
            {
                _logger.LogError(e);
                return new ApiResponse { Success = false, ResponseMessage = "A system error occured while processing the request, try again later." };
            }
        }

        [HttpPost("[action]")]
        public async Task<ApiResponse> RemoveItemFromBasket(string productUuid, int quantity)
        {
            StringBuilder logs = new();
            logs.AppendLine($"Request @ {DateTime.Now}, Path: {Request.Path}");

            try
            {
                var buyerId = Request.Cookies["buyerId"];

                if (buyerId == null) buyerId = Guid.NewGuid().ToString();

                var process = await _basketHelper.RemoveItemFromBasket(productUuid, quantity, buyerId, logs);

                if (!process.Successful) return new ApiResponse { Success = process.Successful, ResponseMessage = process.ResponseMessage };

                return new ApiResponse { Success = true, ResponseMessage = process.ResponseMessage };
            }
            catch (Exception e)
            {
                _logger.LogError(e);
                return new ApiResponse { Success = false, ResponseMessage = "A system error occured while processing the request, try again later." };
            }
        }
    }
}
