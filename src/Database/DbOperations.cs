using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Gloobster.Common;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Gloobster.Database
{
    public static class DatabaseExtensions
    {
        public static T FOD<T>(this IMongoQueryable<T> c, Expression<Func<T, bool>> query)
        {
            return c.FirstOrDefault(query);
        }

        public static List<T> List<T>(this IMongoQueryable<T> c, Expression<Func<T, bool>> query)
        {
            return c.Where(query).ToList();
        }

        public static int Cnt<T>(this IMongoQueryable<T> c, Expression<Func<T, bool>> query)
        {
            return c.Count(query);
        }

        public static List<T> List<T>(this IMongoQueryable<T> c)
        {
            return c.ToList();
        }
    }

    public class ExistResult<T>
    {
        public T Entity { get; set; }
        public bool Exists { get; set; }
    }

    public class DbOperations: IDbOperations
    {
		public DbOperations()
		{			
			Database = GetDatabase();
		}

		public DbOperations(string connectionString, string dbName)
		{

			Database = GetDatabase(dbName, connectionString);
		}
        
		public IMongoClient Client { get; set; }
        public IMongoDatabase Database { get; set; }


        public ExistResult<T> FODR<T>(Expression<Func<T, bool>> query) where T : EntityBase
        {
            T entity = FOD(query);
            return new ExistResult<T>
            {
                Exists = entity != null,
                Entity = entity
            };
        }

        public List<T> List<T>() where T : EntityBase
        {
            var collectionName = GetCollectionName<T>();
            var collection = Database.GetCollection<T>(collectionName);

            var collectionQueryable = collection.AsQueryable();

            var result = collectionQueryable.List();
            return result;
        }

        public List<T> List<T>(Expression<Func<T, bool>> query) where T : EntityBase
        {
            var collectionName = GetCollectionName<T>();
            var collection = Database.GetCollection<T>(collectionName);

            var collectionQueryable = collection.AsQueryable();

            var result = collectionQueryable.List(query);

            return result;
        }

        public int Count<T>(Expression<Func<T, bool>> query) where T : EntityBase
        {
            var collectionName = GetCollectionName<T>();
            var collection = Database.GetCollection<T>(collectionName);

            var collectionQueryable = collection.AsQueryable();

            var result = collectionQueryable.Cnt(query);
            return result;
        }

        public T FOD<T>(Expression<Func<T, bool>> query) where T : EntityBase
        {
            var collectionName = GetCollectionName<T>();
            var collection = Database.GetCollection<T>(collectionName);

            var collectionQueryable = collection.AsQueryable();

            var result = collectionQueryable.FOD(query);

            return result;
        }






        public IMongoClient GetClient(string connectionString)
        {
            var client = new MongoClient(connectionString);
            return client;
        }

        public IMongoDatabase GetDatabase(string dbName = null, string connectionString = null)
        {
	        if (dbName == null)
	        {
		        dbName = GloobsterConfig.DatabaseName;
	        }

			if (connectionString == null)
			{
				connectionString = GloobsterConfig.MongoConnectionString;
			}

			Client = GetClient(connectionString);
            var database = Client.GetDatabase(dbName);
            return database;
        }
		
		public async void DropCollection<T>()
		{
			var collectionName = GetCollectionName<T>();
			await Database.DropCollectionAsync(collectionName);
        }

        public async Task CreateCollection<T>() where T : EntityBase
        {
            bool exists = C<T>().Any();
            if (!exists)
            {
                try
                {
                    var collectionName = GetCollectionName<T>();
                    await Database.CreateCollectionAsync(collectionName);
                }
                catch(Exception exc)
                {
                    
                }
            }
        }
        
        public async Task<T> SaveAsync<T>(T entity) where T: EntityBase
	    {
		    AddEntityIdIfMissing(entity);

			var collectionName = GetCollectionName<T>();
            var collection = Database.GetCollection<BsonDocument>(collectionName);
			
            var bsonDoc = entity.ToBsonDocument();

            await collection.InsertOneAsync(bsonDoc);
			
            return entity;
        }

        public async Task<bool> DeleteAsync<T>(ObjectId id) where T : EntityBase
        {            
            var collectionName = GetCollectionName<T>();
            var collection = Database.GetCollection<T>(collectionName);

            var filter = Builders<T>.Filter.Eq("id", id);            
            await collection.DeleteOneAsync(filter);

            return true;
        }

        public async Task<IEnumerable<T>> SaveManyAsync<T>(IEnumerable<T> entities) where T : EntityBase
		{
			var entitiesList = entities.ToList();
			
			if (!entitiesList.Any())
			{
				return null;
			}

			entitiesList.ForEach(AddEntityIdIfMissing);
			
			var collectionName = GetCollectionName<T>();
			var collection = Database.GetCollection<BsonDocument>(collectionName);
			
			var bsonDocs = entitiesList.Select(e => e.ToBsonDocument());

			await collection.InsertManyAsync(bsonDocs);

			return entitiesList;			
		}

		public IMongoQueryable<T> C<T>() where T : EntityBase
		{
			var collectionName = GetCollectionName<T>();
			var collection = Database.GetCollection<T>(collectionName);
            
            var collectionQueryable = collection.AsQueryable();

			return collectionQueryable;
		}

		public FilterDefinitionBuilder<T> F<T>()
		{
			 return Builders<T>.Filter;
		}

		public UpdateDefinitionBuilder<T> U<T>()
		{
			return Builders<T>.Update;
		}
        
        public async Task<UpdateResult> UpdateAsync<T>(FilterDefinition<T> filter, UpdateDefinition<T> update) where T: EntityBase
		{
			try
			{
				var collectionName = GetCollectionName<T>();
				var collection = Database.GetCollection<T>(collectionName);
                
				var result = await collection.UpdateOneAsync(filter, update);
				return result;
			}
			catch (Exception exc)
			{
				throw exc;
			}
		}

        public async Task<UpdateResult> UpdateManyAsync<T>(FilterDefinition<T> filter, UpdateDefinition<T> update) where T : EntityBase
        {
            try
            {

                var collectionName = GetCollectionName<T>();
                var collection = Database.GetCollection<T>(collectionName);

                var result = await collection.UpdateManyAsync(filter, update);
                return result;
            }
            catch (Exception exc)
            {
                throw exc;
            }
        }

        public async Task<ReplaceOneResult> ReplaceOneAsync<T>(T doc) where T : EntityBase
		{
			var builder = Builders<BsonDocument>.Filter;
			var filter = builder.Eq("_id", doc.id);
			
			var collectionName = GetCollectionName<T>();
			var collection = Database.GetCollection<BsonDocument>(collectionName);

			var docBson = doc.ToBsonDocument();

			ReplaceOneResult result = await collection.ReplaceOneAsync(filter, docBson);
			return result;
		}


		public async Task<T[]> FindAsync<T>(string query = "{}") where T : EntityBase
        {
			try
			{
				var collectionName = GetCollectionName<T>();
				var collection = Database.GetCollection<T>(collectionName);

				var res = collection.Find(query);
                var result = await res.ToListAsync();
				return result.ToArray();
			}
			catch (Exception exc)
			{
				throw exc;
			}
        }
        
        public async Task<long> GetCountAsync<T>(string query = null) where T : EntityBase
        {
            try
            {
                var collectionName = GetCollectionName<T>();
                var collection = Database.GetCollection<T>(collectionName);

                var filter = new BsonDocument();
                if (!string.IsNullOrEmpty(query))
                {
                    filter = BsonDocument.Parse(query);
                }

                long count = await collection.CountAsync(filter);
                return count;
            }
            catch (Exception exc)
            {
                //todo: log, throw
                return 0;
            }
        }

		private string GetCollectionName<T>()
		{
			var entityName = typeof(T).Name;
			var collectionName = entityName.Replace("Entity", string.Empty);
			return collectionName;
		}

		private void AddEntityIdIfMissing(EntityBase entity)
		{
			if (entity.id == ObjectId.Empty)
			{
				entity.id = ObjectId.GenerateNewId();
			}
		}
    }
}