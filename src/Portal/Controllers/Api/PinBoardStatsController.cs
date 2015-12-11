using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.PinBoard;
using Microsoft.AspNet.Mvc;

namespace Gloobster.Portal.Controllers.Api
{	
	[Route("api/[controller]")]
	public class PinBoardStatsController : BaseApiController
	{

		public IVisitedPlacesDomain VisitedPlaces { get; set; }
		public IVisitedCitiesDomain VisitedCities { get; set; }
		public IVisitedCountriesDomain VisitedCountries { get; set; }

		public ICountryService CountryService { get; set; }

		public PinBoardStatsController(IVisitedPlacesDomain visitedPlaces, IVisitedCitiesDomain visitedCities, 
			IVisitedCountriesDomain visitedCountries, ICountryService countryService, IDbOperations db) : base(db)
		{
			VisitedPlaces = visitedPlaces;
			VisitedCities = visitedCities;
			VisitedCountries = visitedCountries;
			CountryService = countryService;
		}


		[HttpGet]
		[Authorize]
		public async Task<IActionResult> Get(PinBoardStatRequest request)
		{
			PinBoardStatResponse result = null;

			if (request.pluginType == PluginType.MyPlacesVisited)
			{
				result = GetMyPlacesVisited(UserId);
			}

			if (request.pluginType == PluginType.MyFriendsVisited)
			{
				result = GetMyFriendsVisited(UserId);
			}

			return new ObjectResult(result);
		}

		private PinBoardStatResponse GetMyFriendsVisited(string userId)
		{
			var result = new PinBoardStatResponse();
			
			var visitedPlaces = VisitedPlaces.GetPlacesOfMyFriendsByUserId(userId);
			result.VisitedPlaces = visitedPlaces.Select(p => p.ToResponse()).ToArray();

			var visitedCities = VisitedCities.GetCitiesOfMyFriendsByUserId(userId);
			result.VisitedCities = visitedCities.Select(c => c.ToResponse()).ToArray();

			var visitedCountries = VisitedCountries.GetCountriesOfMyFriendsByUserId(userId);
			var visitedCountriesResponse = visitedCountries.Select(c => c.ToResponse()).ToList();
			visitedCountriesResponse.ForEach(c => c.CountryCode3 = CountryService.GetCountryByCountryCode2(c.CountryCode2).IsoAlpha3);
			result.VisitedCountries = visitedCountriesResponse.ToArray();

			return result;
		}


		private PinBoardStatResponse GetMyPlacesVisited(string userId)
		{
			var result = new PinBoardStatResponse();

			var visitedPlaces = VisitedPlaces.GetPlacesByUserId(userId);
            result.VisitedPlaces = visitedPlaces.Select(p => p.ToResponse()).ToArray();

			var visitedCities = VisitedCities.GetCitiesByUserId(userId);
			result.VisitedCities = visitedCities.Select(c => c.ToResponse()).ToArray();

			var visitedCountries = VisitedCountries.GetVisitedCountriesByUserId(userId);
			var visitedCountriesResponse = visitedCountries.Select(c => c.ToResponse()).ToList();
			visitedCountriesResponse.ForEach(c => c.CountryCode3 = CountryService.GetCountryByCountryCode2(c.CountryCode2).IsoAlpha3);
			result.VisitedCountries = visitedCountriesResponse.ToArray();

			return result;
		}

	}
}