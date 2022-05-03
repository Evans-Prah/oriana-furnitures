using DataAccess.Executors;
using DataAccess.Models;
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

            return new TotalRatingInfo { Message = "Product has no reviews"};
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



        public async Task<AddBasketDbResponse> AddItemToBasket(string productUuid, int quantity, string buyerId)
        {
            var parameters = new List<StoreProcedureParameter>
            {
                new StoreProcedureParameter { Name = "reqProductUuid", Type = NpgsqlDbType.Varchar, Value = productUuid},
                new StoreProcedureParameter { Name = "reqQuantity", Type = NpgsqlDbType.Integer, Value = quantity},
                new StoreProcedureParameter { Name = "reqBuyerId", Type = NpgsqlDbType.Varchar, Value = buyerId},
            };

            var response = await _storedProcedureExecutor.ExecuteStoredProcedure<AddBasketDbResponse>(_connectionStrings.Default, "\"AddItemToBasket\"", parameters);

            if (response.Count > 0) return response[0];

            return new AddBasketDbResponse { Message = "an error occurred" };
        }

        public async Task<BasketDbResponse> RemoveItemFromBasket(string productUuid, int quantity, string buyerId)
        {
            var parameters = new List<StoreProcedureParameter>
            {
                new StoreProcedureParameter { Name = "reqProductUuid", Type = NpgsqlDbType.Varchar, Value = productUuid},
                new StoreProcedureParameter { Name = "reqQuantity", Type = NpgsqlDbType.Integer, Value = quantity},
                new StoreProcedureParameter { Name = "reqBuyerId", Type = NpgsqlDbType.Varchar, Value = buyerId},
            };

            var response = await _storedProcedureExecutor.ExecuteStoredProcedure<BasketDbResponse>(_connectionStrings.Default, "\"RemoveItemFromBasket\"", parameters);

            if (response.Count > 0) return response[0];

            return new BasketDbResponse { Message = "an error occurred" };
        }


        #endregion


    }
}
