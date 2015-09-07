using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Facebook;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.Mappers;
using Gloobster.WebApiObjects;
using Microsoft.AspNet.Mvc;

namespace Gloobster.Portal.Controllers
{
	[Route("api/[controller]")]
	public class VisitedPlaceController : Controller
	{
		public IVisitedPlacesDomain VisitedPlaces;

		public VisitedPlaceController(IVisitedPlacesDomain visitedPlaces)
		{
			VisitedPlaces = visitedPlaces;
		}

		[HttpGet]
		[Authorize]
		public async Task<IActionResult> Get(string userId)
		{
			List<VisitedPlaceDO> places = await VisitedPlaces.GetPlacesByUserId(userId);

			var response = new VisitedPlaceResponse
			{
				UserId = userId,
				Places = places.Select(p => p.ToResponse()).ToArray()
			};

			return new ObjectResult(response);
		}

		[HttpPost]
		[Authorize]
		public async Task<IActionResult> Post([FromBody]VisitedPlaceItem place, string userId)
		{
			var placeDO = new VisitedPlaceDO
			{
				City = place.City,
				CountryCode = place.CountryCode,
				PlaceLatitude = place.PlaceLatitude,
				PlaceLongitude = place.PlaceLongitude,
				PortalUserId = userId,
				SourceId = place.SourceId
			};

			if (!string.IsNullOrEmpty(place.SourceType))
			{
				placeDO.SourceType = (SourceTypeDO) Enum.Parse(typeof (SourceTypeDO), place.SourceType);
			}

			var places = new List<VisitedPlaceDO> {placeDO};
			var result = await VisitedPlaces.AddNewPlaces(places, userId);
			
			return new ObjectResult(result);
		}

	}
}