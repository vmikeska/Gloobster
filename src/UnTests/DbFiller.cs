using Gloobster.Common;
using Xunit;
using Gloobster.DomainModels.Services.Twitter;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.Sharing.Twitter;

namespace Gloobster.UnitTests
{

	public class DbFiller : TestBase
	{
		[Fact]
		public async void TestTheThing2()
		{
		
		}

		[Fact]
		public async void TestTheThing()
		{
			GloobsterConfig.TwitterConsumerKey = "0gvTaCaKc4acKcMh1m1ah4tR6";
			GloobsterConfig.TwitterConsumerSecret = "sQURat6s73ApQbuQplogDY5jLJ9JSo57xE6qfZ7b81itxmWqJj";

			var driver = new TwitterShare
			{
				MyTwitterSvc = new MyTwitterService()
			};
			
			var options = new TwitterShareOptionsDO
			{
				ImagePath = @"C:\Users\vmike_000\Pictures\ws_Blue_Docks_1920x1080.jpg",
				Status = "This is my status",
				Link = "http://idnes.cz"
			};

			var auth = new SocAuthenticationDO
			{
				AccessToken = "1228562882-DaM75urty2GqQmLZ0T2nBqJQ5CL7iZcxVPHszi0",
				TokenSecret = "qEAUzZnbvdtFJj51gAO0szMVlzCeCHenPBLEp3RRsj3zC"
			};

            driver.Tweet(options, auth);

		}
		

		

	}

	

}
