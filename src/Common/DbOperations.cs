using System.Threading.Tasks;
using Microsoft.Framework.Configuration;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Gloobster.Common
{
    public class DbOperations: IDbOperations
    {

        public static IConfiguration Configuration { get; set; }
        //$"mongodb://{"GloobsterConnector"}:{"Gloobster007"}@{"ds036178.mongolab.com"}:{"36178"}/Gloobster";

        const string DatabaseName = "Gloobster";

        public IMongoClient Client { get; set; }
        public IMongoDatabase Database { get; set; }

        public IMongoClient GetClient()
        {
            var connectionString = Configuration["Data:DefaultConnection:ConnectionString"];
            var client = new MongoClient(connectionString);
            return client;
        }

        public IMongoDatabase GetDatabase()
        {
            Client = GetClient();
            var database = Client.GetDatabase(DatabaseName);
            return database;
        }

        public async Task<T> SaveAsync<T>(T entity)
        {
            if (Database == null)
            {
                Database = GetDatabase();
            }

            var collectionName = entity.GetType().Name;
            var collection = Database.GetCollection<BsonDocument>(collectionName);

            var bsonDoc = entity.ToBsonDocument();

            await collection.InsertOneAsync(bsonDoc);

            return entity;
        }

        public async Task<T[]> FindAsync<T>(string query) 
        {
            if (Database == null)
            {
                Database = GetDatabase();
            }

            var collectionName = typeof(T).Name;
            var collection = Database.GetCollection<T>(collectionName);
            
            var result =  await collection.Find(query).ToListAsync();
            return result.ToArray();
        }
        

        public async Task<long> GetCount<T>(string query = null)
        {
            if (Database == null)
            {
                Database = GetDatabase();
            }

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