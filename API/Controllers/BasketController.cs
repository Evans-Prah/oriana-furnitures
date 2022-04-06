using helpers.BasketHelper;
using helpers.FileLogger;
using Microsoft.AspNetCore.Mvc;
using models;
using models.Payload;
using System.Text;

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

                if (buyerId == null)
                {
                    buyerId = Guid.NewGuid().ToString();
                }

                var basket = await _basketHelper.GetBasket(buyerId);

                if (basket == null || !basket.Any()) return new ApiResponse { Success = false, ResponseMessage = "Basket does not exist" };

                return new ApiResponse { Success = true, ResponseMessage = "Basket fecthed successfully", Data = basket };
            }
            catch (Exception e)
            {
                _logger.LogError(e);
                return new ApiResponse { Success = false, ResponseMessage = "A system error occured while processing request, try again later." };
            }
        }

        [HttpPost("[action]")]
        public async Task<ApiResponse> AddItemToBasket([FromBody] BasketPayload payload)
        {
            StringBuilder logs = new();
            logs.AppendLine($"Request @ {DateTime.Now}, Path: {Request.Path}");

            try
            {
                var buyerId = Request.Cookies["buyerId"];

                if (buyerId == null) buyerId = Guid.NewGuid().ToString();
               
                var process = await _basketHelper.AddItemToBasket(payload.ProductUuid, payload.Quantity, buyerId, logs);

                var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
                Response.Cookies.Append("buyerId", buyerId, cookieOptions);

                if (!process.Successful) return new ApiResponse { Success = process.Successful, ResponseMessage = process.ResponseMessage };

                return new ApiResponse { Success = true, ResponseMessage = process.ResponseMessage };
            }
            catch (Exception e)
            {
                _logger.LogError(e);
                return new ApiResponse { Success = false, ResponseMessage = "A system error occured while processing the request, try again later." };
            }
        }

        [HttpPost("[action]")]
        public async Task<ApiResponse> RemoveItemFromBasket([FromBody] BasketPayload payload)
        {
            StringBuilder logs = new();
            logs.AppendLine($"Request @ {DateTime.Now}, Path: {Request.Path}");

            try
            {
                var buyerId = Request.Cookies["buyerId"];

                if (buyerId == null) buyerId = Guid.NewGuid().ToString();

                var process = await _basketHelper.RemoveItemFromBasket(payload.ProductUuid, payload.Quantity, buyerId, logs);

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
