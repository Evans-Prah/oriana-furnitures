using helpers.DbHelper;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using models;
using models.Authentication;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace helpers.AuthenticationHelper
{
    public class AuthenticationHelper : IAuthenticationHelper
    {
        private readonly IDbHelper _dbHelper;
        private readonly IConfiguration _config;
        private readonly string _encryption_key;
        private readonly string _jwt_encryption_key;
        private readonly double _session_timeout = 30;

        public AuthenticationHelper(IDbHelper dbHelper, IConfiguration config)
        {
            _dbHelper = dbHelper;
            _config = config;
            _encryption_key = config["ENCRYPTION_KEY"];
            _jwt_encryption_key = config["JWT_ENCRYPTION_KEY"];
            _session_timeout = Convert.ToDouble(_config["SESSION_TIMEOUT"]);
        }

        public async Task<HelpersResponse> CreateAccount(string username, string password, string email, string phoneNumber, StringBuilder logs)
        {
            logs.AppendLine("-- CreateAccount");
            logs.AppendLine($"Payload: {JsonConvert.SerializeObject(new { username, email, phoneNumber })}");

            if (string.IsNullOrWhiteSpace(username)) return new HelpersResponse { Successful = false, ResponseMessage = "Username is required" };
            if (string.IsNullOrWhiteSpace(password)) return new HelpersResponse { Successful = false, ResponseMessage = "Password is required" };
            if (string.IsNullOrWhiteSpace(email)) return new HelpersResponse { Successful = false, ResponseMessage = "Email is required" };
            if (string.IsNullOrWhiteSpace(phoneNumber)) return new HelpersResponse { Successful = false, ResponseMessage = "Phone number is required" };

            var accountUuid = Guid.NewGuid().ToString();
            password = StringCipher.Encrypt(password, _encryption_key);

            var dbResponse = await _dbHelper.CreateUserAccount(accountUuid, username, password, email, phoneNumber);
            logs.AppendLine($"DB Response: {JsonConvert.SerializeObject(dbResponse)}");

            if (!string.IsNullOrWhiteSpace(dbResponse)) return new HelpersResponse { Successful = false, ResponseMessage = dbResponse };

            return new HelpersResponse { Successful = true, ResponseMessage = "User account created successfully" };
        }

        public async Task<HelpersResponse> UserLogin(string username, string password, StringBuilder logs)
        {
            logs.AppendLine("-- UserLogin");
            logs.AppendLine($"Payload: {JsonConvert.SerializeObject(new { username })}");

            if (string.IsNullOrWhiteSpace(username)) return new HelpersResponse { Successful = false, ResponseMessage = "Username is required" };
            if (string.IsNullOrWhiteSpace(password)) return new HelpersResponse { Successful = false, ResponseMessage = "Password is required" };

            password = StringCipher.Encrypt(password, _encryption_key);

            var dbResponse = await _dbHelper.ValidateAccountLogin(username, password);
            logs.AppendLine($"DB Response: {JsonConvert.SerializeObject(dbResponse)}");

            if (!string.IsNullOrWhiteSpace(dbResponse.ResponseMessage)) return new HelpersResponse { Successful = false, ResponseMessage = dbResponse.ResponseMessage };

            var tokenInfo = CreateJWTInfo(username, dbResponse.AccountRole);

            return new HelpersResponse
            {
                Successful = true,
                ResponseMessage = "Login successful",
                Data = new AccountLoginInfo
                {
                    Username = dbResponse.Username,
                    Email = dbResponse.Email,
                    PhoneNumber = dbResponse.PhoneNumber,
                    AccountUuid = dbResponse.AccountUuid,
                    AccountRole = dbResponse.AccountRole,
                    Token = tokenInfo,
                    LastLogin = dbResponse.LastLogin,
                }
            };

        }

        

        private JwtInfo CreateJWTInfo(string username, string roles)
        {
            var expiresAt = DateTime.Now.AddMinutes(_session_timeout);
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenKey = Encoding.ASCII.GetBytes(_jwt_encryption_key);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, username),
                    new Claim(ClaimTypes.Expiration, expiresAt.ToString()),
                    new Claim(ClaimTypes.Role, roles)
                }),
                Expires = expiresAt,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenKey),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwtToken = tokenHandler.WriteToken(token);
            jwtToken = StringCipher.Encrypt(jwtToken, _jwt_encryption_key);
            return new JwtInfo { Token = jwtToken, ExpiresAt = expiresAt };
        }

        
    }
}
