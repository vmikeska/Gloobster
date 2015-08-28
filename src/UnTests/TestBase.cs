﻿using Gloobster.Common;

namespace Gloobster.UnitTests
{
	public abstract class TestBase
	{
		public IDbOperations DBOper;

		protected TestBase()
		{
			var config = new GloobsterConfig
			{
				MongoConnectionString = "mongodb://localhost:27017/GloobsterTest",
				DatabaseName = "GloobsterTest"
			};

			DBOper = new DbOperations(config);
		}
		
	}
}