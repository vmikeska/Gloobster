using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;

namespace Gloobster.Portal.Controllers.Api
{
	[Route("api/[controller]")]
	public class PlaceController : BaseApiController
	{				
		public ISearchService SearchSvc { get; set; }
		public IDbOperations DB { get; set; }

		public PlaceController(ISearchService searchService, IDbOperations db) : base(db)
		{
			SearchSvc = searchService;
			DB = db;
		}

		[HttpGet]
		[Authorize]
		public async Task<IActionResult> Get(SearchRequest req)
		{
			var typesCol = ParseTypes(req.types);

			//todo: this is possibly just because of FB access token, keep this token on client, not to query it every time			
			var user = DB.C<PortalUserEntity>().FirstOrDefault(u => u.id == UserIdObj);
			var userDO = user.ToDO();
			
			var queryObj = new SearchServiceQueryDO
			{
				Query = req.placeName,
				PortalUser = userDO,
				CustomProviders = typesCol,				
			};

			bool hasCoordinates = !string.IsNullOrEmpty(req.lat) && !string.IsNullOrEmpty(req.lng);
			if (hasCoordinates)
			{
				queryObj.Coordinates = new LatLng {Lat = float.Parse(req.lat, CultureInfo.InvariantCulture), Lng = float.Parse(req.lng, CultureInfo.InvariantCulture) };
			}
			
			List<Place> result = await SearchSvc.SearchAsync(queryObj);
			return new ObjectResult(result);			
		}

		private SourceType[] ParseTypes(string typesStr)
		{
			var types = typesStr.Split(',').Select(t => (SourceType) int.Parse(t)).ToArray();
			return types;
		}


		
	}

	public class SearchRequest
	{
		public string placeName { get; set; }
		public string types { get; set; }
		public string lat { get; set; }
		public string lng { get; set; }
	}
	

}