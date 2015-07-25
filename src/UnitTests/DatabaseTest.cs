using Gloobster.Common;
using MongoDB.Driver;
using NUnit.Framework;

namespace Gloobster.UnitTests
{
    [TestFixture]
    public class DatabaseTest
    {
        public IMongoDatabase Database { get; set; }

        [SetUp]
        public void Setup()
        {
            Database = DatabaseConnection.GetDatabaseConnection();
        }


        [Test]
        public async void db()
        {
            var collection = Database.GetCollection<FacebookUserEntity>(TableNames.FacebookUser);

            var entity = new FacebookUserEntity { UserId = "adff" };
            await collection.InsertOneAsync(entity);
            var id = entity.Id;
        }

        [Test]
        public void it_should_get_one_user()
        {
            var collection = Database.GetCollection<FacebookUserEntity>(TableNames.FacebookUser);

            //var query = Query<FacebookUserEntity>.EQ(e => e.UserId, "adff");
            //var entity = collection.FindOne(query);
        }

        [Test]
        public void DeleteDatabase()
        {
            var collection = Database.GetCollection<FacebookUserEntity>(TableNames.FacebookUser);

            //collection.RemoveAll();
        }

    }
}
