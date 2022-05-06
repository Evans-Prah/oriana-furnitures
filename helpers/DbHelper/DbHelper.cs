using DataAccess.Executors;
using DataAccess.Models;
using models.Authentication;
using models.Basket;
using models.Product;
using NpgsqlTypes;

namespace helpers.DbHelper
{
    public class DbHelper : IDbHelper
    {
        private readonly DatabaseConnections _connectionStrings;
        private readonly IStoredProcedureExecutor _storedProcedureExecutor;

        public DbHelper(DatabaseConnections connectionStrings, IStoredProcedureExecutor storedProcedureExecutor)
        {
            _connectionStrings = connectionStrings;
            _storedProcedureExecutor = storedProcedureExecutor;
        }

        #region Products

        public async Task<List<ProductsInfo>> GetProducts() => await _storedProcedureExecutor.ExecuteStoredProcedure<ProductsInfo>(_connectionStrings.Default, "\"GetProducts\"", null);

        public async Task<ProductInfo?> GetProduct(string productUuid)
        {
            var parameters = new List<StoreProcedureParameter>
            {
                new StoreProcedureParameter {Name = "reqProductUuid", Type = NpgsqlDbType.Varchar, Value = productUuid}
            };

            var response = await _storedProcedureExecutor.ExecuteStoredProcedure<ProductInfo>(_connectionStrings.Default, "\"GetProduct\"", parameters);

            if (response.Count > 0) return response[0];

            return null;
        }

        public async Task<List<ReviewInfo>> GetProductReviews(string productUuid)
        {
            var parameters = new List<StoreProcedureParameter>
            {
                new StoreProcedureParameter {Name = "reqProductUuid", Type = NpgsqlDbType.Varchar, Value = productUuid}
            };

            return await _storedProcedureExecutor.ExecuteStoredProcedure<ReviewInfo>(_connectionStrings.Default, "\"GetProductReviews\"", parameters);
        }

        public async Task<TotalRatingInfo?> GetTotalProductReviews(string productUuid)
        {
            var parameters = new List<StoreProcedureParameter>
            {
                new StoreProcedureParameter {Name = "reqProductUuid", Type = NpgsqlDbType.Varchar, Value = productUuid}
            };

            var response = await _storedProcedureExecutor.ExecuteStoredProcedure<TotalRatingInfo>(_connectionStrings.Default, "\"GetTotalProductReviews\"", parameters);

            if (response.Count > 0) return response[0];

            return new TotalRatingInfo { Message = "Product has no reviews" };
        }

        #endregion


        #region Basket

        public async Task<BasketInfo> GetBasket(string? buyerId)
        {
            var parameters = new List<StoreProcedureParameter>
             {
                 new StoreProcedureParameter {Name = "reqBuyerId", Type = NpgsqlDbType.Varchar, Value = buyerId}
             };

            var response = await _storedProcedureExecutor.ExecuteStoredProcedure<BasketInfo>(_connectionStrings.Default, "\"GetBasket\"", parameters);


            if (response.Count > 0) return response[0];

            return new BasketInfo { };
        }



        public async Task<AddBasketDbResponse> AddItemToBasket(int productId, int quantity, string buyerId)
        {
            var parameters = new List<StoreProcedureParameter>
            {
                new StoreProcedureParameter { Name = "reqProductId", Type = NpgsqlDbType.Integer, Value = productId},
                new StoreProcedureParameter { Name = "reqQuantity", Type = NpgsqlDbType.Integer, Value = quantity},
                new StoreProcedureParameter { Name = "reqBuyerId", Type = NpgsqlDbType.Varchar, Value = buyerId},
            };

            var response = await _storedProcedureExecutor.ExecuteStoredProcedure<AddBasketDbResponse>(_connectionStrings.Default, "\"AddItemToBasket\"", parameters);

            if (response.Count > 0) return response[0];

            return new AddBasketDbResponse { Message = "an error occurred" };
        }

        public async Task<BasketDbResponse> RemoveItemFromBasket(int productId, int quantity, string buyerId)
        {
            var parameters = new List<StoreProcedureParameter>
            {
                 new StoreProcedureParameter { Name = "reqProductId", Type = NpgsqlDbType.Integer, Value = productId},
                new StoreProcedureParameter { Name = "reqQuantity", Type = NpgsqlDbType.Integer, Value = quantity},
                new StoreProcedureParameter { Name = "reqBuyerId", Type = NpgsqlDbType.Varchar, Value = buyerId},
            };

            var response = await _storedProcedureExecutor.ExecuteStoredProcedure<BasketDbResponse>(_connectionStrings.Default, "\"RemoveItemFromBasket\"", parameters);

            if (response.Count > 0) return response[0];

            return new BasketDbResponse { Message = "an error occurred" };
        }


        #endregion


        #region Authentication

        public async Task<string> CreateUserAccount(string accountUuid, string username, string password, string email, string phoneNumber)
        {
            string response = "";

            var parameters = new List<StoreProcedureParameter>
            {
                new StoreProcedureParameter { Name = "reqAccountUuid", Type = NpgsqlDbType.Varchar, Value = accountUuid},
                new StoreProcedureParameter { Name = "reqUsername", Type = NpgsqlDbType.Varchar, Value = username},
                new StoreProcedureParameter { Name = "reqPassword", Type = NpgsqlDbType.Varchar, Value = password},
                new StoreProcedureParameter { Name = "reqEmail", Type = NpgsqlDbType.Varchar, Value = email},
                new StoreProcedureParameter { Name = "reqPhoneNumber", Type = NpgsqlDbType.Varchar, Value = phoneNumber},
            };

            await _storedProcedureExecutor.ExecuteStoredProcedure(_connectionStrings.Default, "\"CreateUserAccount\"", parameters, (reader) =>
            {
                if (reader.Read()) response = reader.GetString(0);
            });

            return response;
        }

        public async Task<AccountLoginInfo> ValidateAccountLogin(string username, string password)
        {
            var parameters = new List<StoreProcedureParameter>
            {
                new StoreProcedureParameter { Name = "reqUsername", Type = NpgsqlDbType.Varchar, Value = username},
                new StoreProcedureParameter { Name = "reqPassword", Type = NpgsqlDbType.Varchar, Value = password},
            };

            var response = await _storedProcedureExecutor.ExecuteStoredProcedure<AccountLoginInfo>(_connectionStrings.Default, "\"ValidateAccountLogin\"", parameters);

            if (response.Count > 0) return response[0];

            return new AccountLoginInfo { ResponseMessage = "An error occurred" };
        } 
        
        #endregion
    }
}
