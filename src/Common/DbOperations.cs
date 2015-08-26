using System;
using System.Threading.Tasks;
using Gloobster.Common.DbEntity;
using Microsoft.Framework.Configuration;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Gloobster.Common
{
    public class DbOperations: IDbOperations
    {
		public DbOperations(IGloobsterConfig config)
		{
			Config = config;

			Database = GetDatabase();
		}

		public IGloobsterConfig Config;
		//$"mongodb://{"GloobsterConnector"}:{"Gloobster007"}@{"ds036178.mongolab.com"}:{"36178"}/Gloobster";

		const string DatabaseName = "Gloobster";

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
            var database = Client.GetDatabase(DatabaseName);
            return database;
        }

		public async void DropCollection<T>()
		{
			string collectionName = typeof(T).Name;
			await Database.DropCollectionAsync(collectionName);
        }

        public async Task<T> SaveAsync<T>(T entity) where T: EntityBase
        {            
            var collectionName = entity.GetType().Name;
            var collection = Database.GetCollection<BsonDocument>(collectionName);

            entity.id = ObjectId.GenerateNewId();

            var bsonDoc = entity.ToBsonDocument();

            await collection.InsertOneAsync(bsonDoc);

            return entity;
        }

        public async Task<T[]> FindAsync<T>(string query) where T : EntityBase
        {            
            var collectionName = typeof(T).Name;
            var collection = Database.GetCollection<T>(collectionName);
            
            var result =  await collection.Find(query).ToListAsync();
            return result.ToArray();
        }
        

        public async Task<long> GetCount<T>(string query = null) where T : EntityBase
        {            
            var collectionName = typeof(T).Name;
            var collection = Database.GetCollection<T>(collectionName);

            var filter = new BsonDocument();
            if (!string.IsNullOrEmpty(query))
            {
                filter = BsonDocument.Parse(query);
            }

            long count = await collection.CountAsync(filter);
            return count;
        }
    }
}