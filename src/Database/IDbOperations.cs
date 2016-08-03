using System;
using System.Collections.Generic;
using System.Linq.Expressions;
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
        UpdateDefinition<T> PF<T, TT>(Expression<Func<T,IEnumerable<TT>>> field, Expression<Func<TT,bool>> filter);

        IMongoQueryable<T> C<T>() where T : EntityBase;

        Task<ReplaceOneResult> ReplaceOneAsync<T>(T doc) where T : EntityBase;

		Task<T> SaveAsync<T>(T entity) where T: EntityBase;
        Task<T> SaveCustomAsync<T>(T entity, string customName) where T : EntityBase;
        Task<IEnumerable<T>> SaveManyAsync<T>(IEnumerable<T> entities) where T : EntityBase;

		Task<T[]> FindAsync<T>(string query = "{}") where T : EntityBase;
        
        Task<long> GetCountAsync<T>(string query = null) where T : EntityBase;

		Task<UpdateResult> UpdateAsync<T>(FilterDefinition<T> filter, UpdateDefinition<T> update) where T : EntityBase;

        Task<UpdateResult> UpdateManyAsync<T>(FilterDefinition<T> filter, UpdateDefinition<T> update) where T : EntityBase;

        Task<bool> DeleteAsync<T>(ObjectId id) where T : EntityBase;
        Task<bool> DeleteAsync<T>(Expression<Func<T, bool>> query) where T : EntityBase;

        IMongoClient Client { get; set; }
        IMongoDatabase Database { get; set; }

		void DropCollection<T>();
        Task CreateCollection<T>() where T : EntityBase;

        int Count<T>(Expression<Func<T, bool>> query) where T : EntityBase;
        ExistResult<T> FODR<T>(Expression<Func<T, bool>> query) where T : EntityBase;
        T FOD<T>(Expression<Func<T, bool>> query) where T : EntityBase;
        List<T> List<T>(Expression<Func<T, bool>> query) where T : EntityBase;
        List<T> List<T>() where T : EntityBase;
    }
}