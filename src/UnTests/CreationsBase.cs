using Gloobster.Common;

namespace Gloobster.UnitTests
{
	public class CreationsBase
	{
		public static IDbOperations DB;

		static CreationsBase()
		{
			var config = new GloobsterConfig
			{
				MongoConnectionString = "mongodb://localhost:27017/GloobsterTest",
				DatabaseName = "GloobsterTest"
			};

			DB = new DbOperations(config);
		}
	}
}