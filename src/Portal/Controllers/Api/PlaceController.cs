using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels.Services.GeonamesService;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Mappers;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;

namespace Gloobster.Portal.Controllers
{
	[Route("api/[controller]")]
	public class PlaceController : Controller
	{				
		public ISearchService SearchSvc { get; set; }
		public IDbOperations DB { get; set; }

		public PlaceController(ISearchService searchService, IDbOperations db)
		{
			SearchSvc = searchService;
			DB = db;
		}

		[HttpGet]
		[Authorize]
		public async Task<IActionResult> Get(string placeName, string types, string userId)
		{
			var typesCol = ParseTypes(types);

			//todo: this is possibly just because of FB access token, keep this token on client, not to query it every time
			var userIdObj = new ObjectId(userId);
			var user = DB.C<PortalUserEntity>().FirstOrDefault(u => u.id == userIdObj);
			var userDO = user.ToDO();
			
			var queryObj = new SearchServiceQueryDO
			{
				Query = placeName,
				PortalUser = userDO,
				CustomProviders = typesCol
			};

			List<Place> result = await SearchSvc.SearchAsync(queryObj);
			return new ObjectResult(result);			
		}

		private SourceType[] ParseTypes(string typesStr)
		{
			var types = typesStr.Split(',').Select(t => (SourceType) int.Parse(t)).ToArray();
			return types;
		}
	}
}