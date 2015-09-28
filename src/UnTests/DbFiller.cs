using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Autofac.Core;
using FourSquare.SharpSquare.Core;
using FourSquare.SharpSquare.Entities;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
using Gloobster.Common.DbEntity.PortalUser;
using Gloobster.DomainModels.Services.CountryService;
using Gloobster.DomainModels.Services.GeonamesService;
using Gloobster.DomainModels.Services.PlaceSearch;
using Gloobster.DomainModelsCommon.BaseClasses;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.SocialLogin.Facebook.Communication;
using Xunit;
using Gloobster.DomainModels.Services.Foursquare;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.Mappers;
using Newtonsoft.Json;

namespace Gloobster.UnitTests
{

	public class DbFiller : TestBase
	{


		[Fact]
		public async void TestTheThing()
		{
			var token =
				"CAAVlse7iUKoBAF76FzYl0gXEScFt7C9vfHJi1O987Vjr7ZBGfaZC86WZCsXlFIaYbBMQtc35Mwz1kJzgb6ftQVP89yzYI9rd7hsL2fQEXRX4xtQRnZBQIDPFPNxoBVAdxHvFF2nWomkw8UMyAXo9jRD3vZC818EqPnFrK9tZAcMituEqIyeUoQ3NFQYG5ROXMZD";

			var fb = new FacebookService();
			fb.SetAccessToken(token);

			var query = "search?q=pavlovice&type=place";
			//"search?q=coffee&type=place&center=37.76,122.427&distance=1000";

			var result = fb.Get<SearchedPlacesFO>(query);
			var resultTxt = fb.Get(query);

			var ser = JsonConvert.SerializeObject(result);

		}

		[Fact]
		public async void TestTheThing2()
		{
			string clientId = "RW5T0GSXYHMN5W2P4DLPYEOR1UYXXKGIFDMNBBM15XE0MQZ1";
			string clientSecret = "HHHLCEDL3YSQAM5BNCT4HZXQ2BVLRGROMS5IUHMITIDAROWJ";


			SharpSquare sharpSquare = new SharpSquare(clientId, clientSecret);

			var prms = new Dictionary<string, string>
			{
				//{"v", "20130815"},
				//{"ll", "40.7,-74"},
				{"query", "Praha"}
			};
			List<Venue> venues = sharpSquare.SearchVenues( prms);
		}

		[Fact]
		public async void Search()
		{
			var service = new SearchService(null);

			var queryObj = new SearchServiceQuery {Query = "Praha"};

			var portalUserEntity = await DBOper.FindAsync<PortalUserEntity>("{'Mail': 'vmikeska@hotmail.com'}");
			var portalUser = portalUserEntity.First().ToDO();
			queryObj.PortalUser = portalUser;

			string clientId = "RW5T0GSXYHMN5W2P4DLPYEOR1UYXXKGIFDMNBBM15XE0MQZ1";
			string clientSecret = "HHHLCEDL3YSQAM5BNCT4HZXQ2BVLRGROMS5IUHMITIDAROWJ";

			var foursquareService = new FoursquareService();
			foursquareService.Initialize(clientId, clientSecret);
			var foursquareProvider = new FoursquareSearchProvider
			{
				Service = foursquareService
			};


			var gnSearchProvider = new GeoNamesSearchProvider
			{
				Service = new GeoNamesService()
			};

			var fbProvider = new FacebookSearchProvider
			{
				Service = new FacebookService(),
				CountrySvc = new CountryService()
			};

			service.SearchProviders = new List<ISearchProvider>
			{
				gnSearchProvider,
				foursquareProvider,
				fbProvider
			};

			var coord = new LatLng {Lat = 50.0833, Lng = 14.4167};

			var places = await service.SearchAsync(queryObj);
		}

		

	}

	

}
