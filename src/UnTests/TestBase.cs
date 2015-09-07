using Gloobster.Common;

namespace Gloobster.UnitTests
{
	public abstract class TestBase
	{
		public IDbOperations DBOper;

		protected TestBase()
		{
			GloobsterConfig.MongoConnectionString = "mongodb://localhost:27017/GloobsterTest";
			GloobsterConfig.DatabaseName = "GloobsterTest";
			GloobsterConfig.AppSecret = "ASDF";
			
			DBOper = new DbOperations();
		}
		
	}
}