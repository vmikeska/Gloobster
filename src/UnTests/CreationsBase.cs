using Gloobster.Common;
using Gloobster.Database;

namespace Gloobster.UnitTests
{
	public class CreationsBase
	{
		public static IDbOperations DB;

		static CreationsBase()
		{
			GloobsterConfig.MongoConnectionString = "mongodb://localhost:27017/GloobsterTest";
			GloobsterConfig.DatabaseName = "GloobsterTest";
			GloobsterConfig.AppSecret = "ASDF";


			DB = new DbOperations();
		}
	}
}