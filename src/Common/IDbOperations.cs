using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Common.DbEntity;
using MongoDB.Driver;

namespace Gloobster.Common
{
    public interface IDbOperations
    {
        Task<T> SaveAsync<T>(T entity) where T: EntityBase;
     
        Task<T[]> FindAsync<T>(string query) where T : EntityBase;

        Task<long> GetCount<T>(string query = null) where T : EntityBase;

        IMongoClient Client { get; set; }
        IMongoDatabase Database { get; set; }
    }
}