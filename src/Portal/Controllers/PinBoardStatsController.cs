using System.Threading.Tasks;
using Gloobster.WebApiObjects;
using Microsoft.AspNet.Mvc;

namespace Gloobster.Portal.Controllers
{
	public enum PluginType { MyPlacesVisited, MyFriendsVisited, MyFriendsDesired}

	public enum DisplayEntity { Pin, Heat, Countries}

	public class PinBoardStatRequest
	{
		public PluginType pluginType { get; set; }
		public DisplayEntity[] displayEntities { get; set; }

	}

	public class VisitedPlaceResponse2
	{
		public string UserId { get; set; }
		public VisitedPlaceRequest[] Places { get; set; }
	}

	public class VisitedCountryItem
	{
		public string CountryCode2 { get; set; }
		public string CountryCode3 { get; set; }
		public int ColorId { get; set; }
	}

	public class VisitedPlaceItem2
	{
		public string CountryCode { get; set; }
		public string City { get; set; }
		public float PlaceLatitude { get; set; }
		public float PlaceLongitude { get; set; }
		public string SourceId { get; set; }
		public string SourceType { get; set; }
	}

	public class VisitedCityItem
	{
		public string CountryCode { get; set; }
		public string City { get; set; }
		public float PlaceLatitude { get; set; }
		public float PlaceLongitude { get; set; }
		public string PlaceId { get; set; }
		
	}

	public class PinBoardStatResponse
	{
		public VisitedCityItem[] VisitedCities { get; set; }
		public VisitedPlaceItem2[] VisitedPlaces { get; set; }
		public VisitedCountryItem[] VisitedCountry { get; set; }
	}


	[Route("api/[controller]")]
	public class PinBoardStatsController : Controller
	{
		[HttpGet]
		[Authorize]
		public async Task<IActionResult> Get([FromBody]PinBoardStatRequest request, string userId)
		{
			

			return new ObjectResult(null);
		}


		private void GetMyPlacesVisited()
		{
			//List<VisitedCityDO> places = await VisitedCities.GetCitiesByUserId(userId);
		}





		//public IVisitedCitiesDomain VisitedCities;

		//public PinBoardStatsController(IVisitedCitiesDomain VisitedCities)
		//{
		//	VisitedCities = VisitedCities;
		//}

		//[HttpGet]
		//[Authorize]
		//public async Task<IActionResult> Get(string userId)
		//{
		//	List<VisitedCityDO> places = await VisitedCities.GetCitiesByUserId(userId);

		//	var response = new VisitedPlacesRequest
		//	{
		//		UserId = userId,
		//		Places = places.Select(p => p.ToResponse()).ToArray()
		//	};

		//	return new ObjectResult(response);
		//}

		//[HttpPost]
		//[Authorize]
		//public async Task<IActionResult> Post([FromBody]VisitedPlaceRequest place, string userId)
		//{
		//	var placeDO = new VisitedCityDO
		//	{
		//		City = place.City,
		//		CountryCode = place.CountryCode,
		//		Latitude = place.Latitude,
		//		Longitude = place.Longitude,
		//		PortalUserId = userId,
		//		SourceId = place.SourceId
		//	};

		//	if (!string.IsNullOrEmpty(place.SourceType))
		//	{
		//		placeDO.SourceType = (SourceTypeDO) Enum.Parse(typeof (SourceTypeDO), place.SourceType);
		//	}

		//	var places = new List<VisitedCityDO> {placeDO};
		//	var result = await VisitedCities.AddNewCities(places, userId);

		//	return new ObjectResult(result);
		//}

	}
}