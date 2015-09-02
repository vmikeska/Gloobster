using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

	}
}