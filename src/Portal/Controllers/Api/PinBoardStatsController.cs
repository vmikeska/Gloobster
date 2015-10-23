using System.Linq;
using System.Threading.Tasks;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.WebApiObjects;
using Gloobster.WebApiObjects.PinBoard;
using Microsoft.AspNet.Mvc;
using Gloobster.Mappers;

namespace Gloobster.Portal.Controllers
{
	public enum PluginType { MyPlacesVisited, MyFriendsVisited, MyFriendsDesired}

	public enum DisplayEntity { Pin, Heat, Countries}

	public class PinBoardStatRequest
	{
		public PluginType pluginType { get; set; }
		public DisplayEntity displayEntity { get; set; }
	}
	

	
	[Route("api/[controller]")]
	public class PinBoardStatsController : Controller
	{

		public IVisitedPlacesDomain VisitedPlaces { get; set; }
		public IVisitedCitiesDomain VisitedCities { get; set; }
		public IVisitedCountriesDomain VisitedCountries { get; set; }

		public ICountryService CountryService { get; set; }

		public PinBoardStatsController(IVisitedPlacesDomain visitedPlaces, IVisitedCitiesDomain visitedCities, 
			IVisitedCountriesDomain visitedCountries, ICountryService countryService)
		{
			VisitedPlaces = visitedPlaces;
			VisitedCities = visitedCities;
			VisitedCountries = visitedCountries;
			CountryService = countryService;
		}


		[HttpGet]
		[Authorize]
		public async Task<IActionResult> Get(PinBoardStatRequest request, string userId)
		{
			PinBoardStatResponse result = null;

			if (request.pluginType == PluginType.MyPlacesVisited)
			{
				result = await GetMyPlacesVisitedAsync(userId);
			}

			if (request.pluginType == PluginType.MyFriendsVisited)
			{
				result = GetMyFriendsVisited(userId);
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


		private async Task<PinBoardStatResponse> GetMyPlacesVisitedAsync(string userId)
		{
			var result = new PinBoardStatResponse();

			var visitedPlaces = await VisitedPlaces.GetPlacesByUserIdAsync(userId);
            result.VisitedPlaces = visitedPlaces.Select(p => p.ToResponse()).ToArray();

			var visitedCities = VisitedCities.GetCitiesByUserId(userId);
			result.VisitedCities = visitedCities.Select(c => c.ToResponse()).ToArray();

			var visitedCountries = await VisitedCountries.GetVisitedCountriesByUserIdAsync(userId);
			var visitedCountriesResponse = visitedCountries.Select(c => c.ToResponse()).ToList();
			visitedCountriesResponse.ForEach(c => c.CountryCode3 = CountryService.GetCountryByCountryCode2(c.CountryCode2).IsoAlpha3);
			result.VisitedCountries = visitedCountriesResponse.ToArray();

			return result;
		}

	}
}