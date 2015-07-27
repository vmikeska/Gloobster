using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;

namespace Gloobster.Common
{
    public interface IDbOperations
    {
        Task<T> SaveAsync<T>(T entity);
     
        Task<T[]> FindAsync<T>(string query);

        Task<long> GetCount<T>(string query = null);

        IMongoClient Client { get; set; }
        IMongoDatabase Database { get; set; }
    }
}