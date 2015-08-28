using System.IO;
using System.Net;
using Gloobster.DomainModels.Services;
using Gloobster.DomainModels.Services.GeonamesService;
using Xunit;

namespace Gloobster.UnitTests
{
	
	public class DbFiller: TestBase
	{


		//[Fact]
		public async void TestTheThing()
		{
			

			var cityName = "Brno";
			var country = "CZ";

			var geoNames = new GeoNamesService();
			geoNames.Initialize("demo1");

			var result = await geoNames.GetCityAsync(cityName, country, 1);

		}

		
		
	}
}
