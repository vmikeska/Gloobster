

using MongoDB.Driver;

namespace Gloobster.Common
{
	public static class DatabaseConnection
	{
		public static IMongoDatabase GetDatabaseConnection()
		{
			var connectionString = "mongodb://localhost";

			var client = new MongoClient(connectionString);
			//IMongoServer server = client. GetServer();

            IMongoDatabase database = client.GetDatabase("FBTraveller");
			return database;
		}
	}
}
