using models;
using System.Text;

namespace helpers.AuthenticationHelper
{
    public interface IAuthenticationHelper
    {
        Task<HelpersResponse> CreateAccount(string username, string password, string email, string phoneNumber, StringBuilder logs);
        Task<HelpersResponse> GetUserDetails(string username);
        Task<HelpersResponse> UserLogin(string username, string password, StringBuilder logs);
    }
}