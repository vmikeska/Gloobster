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
		public IVisitedCitiesDomain VisitedCities;

		public VisitedPlaceController(IVisitedCitiesDomain visitedCities)
		{
			VisitedCities = visitedCities;
		}

		[HttpGet]
		[Authorize]
		public async Task<IActionResult> Get(string userId)
		{
			List<VisitedCityDO> places = await VisitedCities.GetCitiesByUserIdAsync(userId);

			var response = new VisitedPlacesRequest
			{
				UserId = userId,
				//Places = places.Select(p => p.ToResponse()).ToArray()
			};

			return new ObjectResult(response);
		}

		[HttpPost]
		[Authorize]
		public async Task<IActionResult> Post([FromBody]VisitedPlaceRequest place, string userId)
		{
			var placeDO = new VisitedPlaceDO
			{
				City = place.City,
				CountryCode = place.CountryCode,
				Location = place.Location,				
				PortalUserId = userId,
				Dates = place.Dates,
				SourceId = place.SourceId,
				SourceType = (SourceTypeDO)place.SourceType				
			};

			//if (!string.IsNullOrEmpty(place.SourceType))
			//{
			//	placeDO.SourceType = (SourceTypeDO) Enum.Parse(typeof (SourceTypeDO), place.SourceType);
			//}

			//todo: implement logic for adding each SourceType

			//var places = new List<VisitedCityDO> {placeDO};
			//var result = await VisitedCities.AddNewCities(places, userId);
			
			return new ObjectResult(null);
		}

	}
}