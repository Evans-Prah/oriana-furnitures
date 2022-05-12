using helpers.AuthenticationHelper;
using helpers.FileLogger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using models;
using models.Payload;
using System.Text;

namespace API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationHelper _authHelper;
        private readonly IFileLogger _logger;

        public AuthenticationController(IAuthenticationHelper authHelper, IFileLogger logger)
        {
            _authHelper = authHelper;
            _logger = logger;
        }

        [HttpPost("[action]")]
        public async Task<ApiResponse> Register([FromBody] AccountRegisterPayload payload)
        {
            StringBuilder logs = new();
            logs.AppendLine($"Request @ {DateTime.Now}, Path: {Request.Path}");

            try
            {
                var process = await _authHelper.CreateAccount(payload.Username, payload.Password, payload.Email, payload.PhoneNumber, logs);

                if(!process.Successful) return new ApiResponse { Success = false, ResponseMessage = process.ResponseMessage };

                return new ApiResponse { Success = true, ResponseMessage = process.ResponseMessage };
            }
            catch (Exception e)
            {
                _logger.LogError(e);
                return new ApiResponse { Success = false, ResponseMessage = "A system error occured while processing the request, try again later." };
            }
        }
        
        [HttpPost("[action]")]
        public async Task<ApiResponse> Login([FromBody] AccountLoginPayload payload)
        {
            StringBuilder logs = new();
            logs.AppendLine($"Request @ {DateTime.Now}, Path: {Request.Path}");

            try
            {
                var process = await _authHelper.UserLogin(payload.Username, payload.Password, logs);

                if(!process.Successful) return new ApiResponse { Success = false, ResponseMessage = process.ResponseMessage };

                return new ApiResponse { Success = true, ResponseMessage = process.ResponseMessage, Data = process.Data };
            }
            catch (Exception e)
            {
                _logger.LogError(e);
                return new ApiResponse { Success = false, ResponseMessage = "A system error occured while processing the request, try again later." };
            }
        }

        [Authorize]
        [HttpGet("[action]")]
        public ApiResponse VerifySession()
        {
            return new ApiResponse { Success = true };
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<ApiResponse> GetUserDetails([FromBody] UserPayload payload)
        {
            
            try
            {
                var process = await _authHelper.GetUserDetails(payload.Username);

                if(!process.Successful) return new ApiResponse { Success = false, ResponseMessage = process.ResponseMessage };

                return new ApiResponse { Success = true, ResponseMessage = process.ResponseMessage, Data = process.Data };
            }
            catch (Exception e)
            {
                _logger.LogError(e);
                return new ApiResponse { Success = false, ResponseMessage = "A system error occured while processing the request, try again later." };
            }
        }
    }
}
