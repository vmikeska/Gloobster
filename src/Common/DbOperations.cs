using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common.DbEntity;
using Microsoft.Framework.Configuration;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Gloobster.Common
{
	public class EmptyEntityIdException : Exception
	{
		private const string ExceptionMessageBase = "Id of '{0}' is empty";

		public EmptyEntityIdException() {}

		public EmptyEntityIdException(EntityBase entity): base(BuildMessage(entity)) {}
		private static string BuildMessage(EntityBase entity)
		{
			var message = string.Format(ExceptionMessageBase, entity.GetType().Name);
			return message;
		}

	}

	public class DbOperations: IDbOperations
    {
		public DbOperations(IGloobsterConfig config)
		{
			Config = config;

			Database = GetDatabase();
		}

		public IGloobsterConfig Config;
		//$"mongodb://{"GloobsterConnector"}:{"Gloobster007"}@{"ds036178.mongolab.com"}:{"36178"}/Gloobster";
		
        public IMongoClient Client { get; set; }
        public IMongoDatabase Database { get; set; }

        public IMongoClient GetClient()
        {
            //var connectionString = Configuration["Data:DefaultConnection:ConnectionString"];
            var client = new MongoClient(Config.MongoConnectionString);
            return client;
        }

        public IMongoDatabase GetDatabase()
        {
            Client = GetClient();
            var database = Client.GetDatabase(Config.DatabaseName);
            return database;
        }

		public async void DropCollection<T>()
		{
			var collectionName = GetCollectionName<T>();
			await Database.DropCollectionAsync(collectionName);
        }
		
	    public async Task<T> SaveAsync<T>(T entity) where T: EntityBase
	    {
		    TestEntityForId(entity);

			var collectionName = GetCollectionName<T>();
            var collection = Database.GetCollection<BsonDocument>(collectionName);

            entity.id = ObjectId.GenerateNewId();

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

			var collectionName = GetCollectionName<T>();
			var collection = Database.GetCollection<BsonDocument>(collectionName);

			entitiesList.ForEach(e => e.id = ObjectId.GenerateNewId());
			
			var bsonDocs = entitiesList.Select(e => e.ToBsonDocument());

			await collection.InsertManyAsync(bsonDocs);

			return entitiesList;			
		}

		public async Task<UpdateResult> UpdateAsync<T>(T entity, FilterDefinition<BsonDocument> filter) where T : EntityBase
		{			
			TestEntityForId(entity);

			var collectionName = GetCollectionName<T>();
			var collection = Database.GetCollection<BsonDocument>(collectionName);
			
			var bsonDoc = entity.ToBsonDocument();

		    UpdateResult result = await collection.UpdateOneAsync(filter, bsonDoc);
		    return result;
		}

		public async Task<UpdateResult> UpdateAsync<T>(UpdateDefinition<BsonDocument> update, FilterDefinition<BsonDocument> filter)
		{
			var collectionName = GetCollectionName<T>();
			var collection = Database.GetCollection<BsonDocument>(collectionName);
			
			UpdateResult result = await collection.UpdateOneAsync(filter, update);
			return result;
		}

		

		public async Task<T[]> FindAsync<T>(string query) where T : EntityBase
        {
			var collectionName = GetCollectionName<T>();
			var collection = Database.GetCollection<T>(collectionName);
            
            var result =  await collection.Find(query).ToListAsync();
            return result.ToArray();
        }
        

        public async Task<long> GetCount<T>(string query = null) where T : EntityBase
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

		private void TestEntityForId(EntityBase entity)
		{
			if (entity.id == ObjectId.Empty)
			{
				throw new EmptyEntityIdException(entity);
			}
		}
    }
}