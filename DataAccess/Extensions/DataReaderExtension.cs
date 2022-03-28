using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;

namespace DataAccess.Extensions
{
    public static class DataReaderExtension
    {
        public static bool IsDBNull(this IDataReader dataReader, string columnName)
        {
            return dataReader[columnName] == DBNull.Value;
        }
        public static T Get<T>(this IDataReader dataReader, string columnName)
        {
            try
            {
                return IsDBNull(dataReader, columnName) ? default(T) : (T)dataReader[columnName];
            }
            catch (Exception)
            {
                return default(T);
            }
            
        }

        public static List<T> toModel<T>(this IDataReader reader)
        {
            var r = reader.Serialize();
            string json = JsonConvert.SerializeObject(r, Formatting.Indented);
            return JsonConvert.DeserializeObject<List<T>>(json);
        }

        public static IEnumerable<Dictionary<string, object>> Serialize(this IDataReader reader)
        {
            var results = new List<Dictionary<string, object>>();
            var cols = new List<string>();
            for (var i = 0; i < reader.FieldCount; i++)
                cols.Add(reader.GetName(i));

            while (reader.Read())
                results.Add(SerializeRow(cols, reader));

            return results;
        }
        private static Dictionary<string, object> SerializeRow(IEnumerable<string> cols, IDataReader reader)
        {
            var result = new Dictionary<string, object>();
            foreach (var col in cols)
                result.Add(col, reader[col]);
            return result;
        }
    }
}
