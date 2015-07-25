using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Goobster.Portal.Services
{
    public class DbClass: IDbClass
    {
        readonly string _conStr =
            $"mongodb://{"GloobsterConnector"}:{"Gloobster007"}@{"ds036178.mongolab.com"}:{"36178"}/Gloobster";

        const string DatabaseName = "Gloobster";

        public IMongoClient Client { get; set; }
        public IMongoDatabase Database { get; set; }
 

        public IMongoClient GetClient()
        {
            var client = new MongoClient(_conStr);
            return client;
        }

        public IMongoDatabase GetDatabase()
        {
            var client = GetClient();
            var database = client.GetDatabase(DatabaseName);
            return database;
        }

        public async void Save(object entity)
        {
            if (Database == null)
            {
                Database = GetDatabase();
            }

            var collectionName = entity.GetType().Name;

            var collection = Database.GetCollection<BsonDocument>(collectionName);

            var bsonDoc = entity.ToBsonDocument();

            await collection.InsertOneAsync(bsonDoc);
        }

        public List<T> Find<T>(string query)
        {
            var collectionName = typeof(T).Name;
            var collection = Database.GetCollection<BsonDocument>(collectionName);

            var result = collection.Find(query).ToListAsync();
            return result;
        }
    }
}