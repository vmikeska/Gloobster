using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Gloobster.Database
{
    public interface IDbOperations
    {

	    FilterDefinitionBuilder<T> F<T>();
	    UpdateDefinitionBuilder<T> U<T>();

		IMongoQueryable<T> C<T>() where T : EntityBase;

        Task<ReplaceOneResult> ReplaceOneAsync<T>(T doc) where T : EntityBase;

		Task<T> SaveAsync<T>(T entity) where T: EntityBase;
	    Task<IEnumerable<T>> SaveManyAsync<T>(IEnumerable<T> entities) where T : EntityBase;

		Task<T[]> FindAsync<T>(string query = "{}") where T : EntityBase;

        Task<long> GetCountAsync<T>(string query = null) where T : EntityBase;

		Task<UpdateResult> UpdateAsync<T>(FilterDefinition<T> filter, UpdateDefinition<T> update) where T : EntityBase;

		IMongoClient Client { get; set; }
        IMongoDatabase Database { get; set; }

		void DropCollection<T>();
    }
}