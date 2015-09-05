using System.IO;
using System.Net;
using Gloobster.Common;
using Gloobster.DomainModels.Services;
using Gloobster.DomainModels.Services.GeonamesService;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Gloobster.UnitTests
{
	
	public class DbFiller: TestBase
	{


		[Fact]
		public async void TestTheThing()
		{
			var secret = "asdffd";
			
			var jObject = JObject.Parse(@"{""test"": ""myTest""}");

			var encodedStr = JsonWebToken.Encode(jObject, secret, JwtHashAlgorithm.HS512);
			var decodedStr = JsonWebToken.Decode(encodedStr, secret, true);



		}

		
		
	}

	
}
