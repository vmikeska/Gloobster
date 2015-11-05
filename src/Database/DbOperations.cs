using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Gloobster.Common;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Gloobster.Database
{
	public class DbOperations: IDbOperations
    {
		public DbOperations()
		{
			
			Database = GetDatabase();
		}
		
		//$"mongodb://{"GloobsterConnector"}:{"Gloobster007"}@{"ds036178.mongolab.com"}:{"36178"}/Gloobster";
		
        public IMongoClient Client { get; set; }
        public IMongoDatabase Database { get; set; }

        public IMongoClient GetClient()
        {
            //var connectionString = Configuration["Data:DefaultConnection:ConnectionString"];
            var client = new MongoClient(GloobsterConfig.MongoConnectionString);
            return client;
        }

        public IMongoDatabase GetDatabase()
        {
            Client = GetClient();
            var database = Client.GetDatabase(GloobsterConfig.DatabaseName);
            return database;
        }
		
		public async void DropCollection<T>()
		{
			var collectionName = GetCollectionName<T>();
			await Database.DropCollectionAsync(collectionName);
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
			var collectionName = GetCollectionName<T>();
			var collection = Database.GetCollection<T>(collectionName);
			
			var result = await collection.UpdateOneAsync(filter, update);
			return result;
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