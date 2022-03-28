using helpers.FileLogger;
using helpers.ProductsHelper;
using Microsoft.AspNetCore.Mvc;
using models;

namespace API.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductsHelper _productsHelper;
        private readonly IFileLogger _logger;

        public ProductsController(IProductsHelper productsHelper, IFileLogger logger)
        {
            _productsHelper = productsHelper;
            _logger = logger;
        }

        [HttpGet("[action]")]
        public async Task<ApiResponse> GetProducts()
        {
            try
            {
                var products = await _productsHelper.GetProducts();

                if (products == null) return new ApiResponse { Success = false, ResponseMessage = "Products is empty" };

                return new ApiResponse { Success = true, ResponseMessage = "Products fetched successfully", Data = products };
            }
            catch (Exception e)
            {
                _logger.LogError(e);
                return new ApiResponse { Success = false, ResponseMessage = "An system error occured while processing request, try again later." };
            }
        }

        [HttpGet("[action]/{productUuid}")]
        public async Task<ApiResponse> GetProduct(string productUuid)
        {
            try
            {
                var product = await _productsHelper.GetProduct(productUuid);

                if (product == null) return new ApiResponse { Success = false, ResponseMessage = "Product does not exist" };

                return new ApiResponse { Success = true, ResponseMessage = "Product details fetched sucessfully", Data = product };
            }
            catch (Exception e)
            {
                _logger.LogError(e);
                return new ApiResponse { Success = false, ResponseMessage = "An system error occured while processing request, try again later." };
            }
        }
    }
}
