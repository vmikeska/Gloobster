using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
using Gloobster.Common.DbEntity.PortalUser;
using Gloobster.DomainModels.Services.GeonamesService;
using Gloobster.DomainModelsCommon.BaseClasses;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
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
		public async Task<IActionResult> Get(string placeName, string userId)
		{
			var userIdObj = new ObjectId(userId);
			var user = DB.C<PortalUserEntity>().FirstOrDefault(u => u.id == userIdObj);
			var userDO = user.ToDO();
			
			var queryObj = new SearchServiceQuery
			{
				Query = placeName,
				PortalUser = userDO
			};

			List<Place> result = await SearchSvc.SearchAsync(queryObj);
			return new ObjectResult(result);			
		}		
	}
}