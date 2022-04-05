﻿using DataAccess.Executors;
using DataAccess.Models;
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


    }
}
