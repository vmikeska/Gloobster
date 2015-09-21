using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
using Gloobster.DomainModels.Services.GeonamesService;
using Gloobster.DomainModelsCommon.BaseClasses;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.Mappers;
using Microsoft.AspNet.Mvc;

namespace Gloobster.Portal.Controllers
{
	[Route("api/[controller]")]
	public class PlaceController : Controller
	{
		//public IGeoNamesService GeoNames;
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
			var query = $"{{ '_id': ObjectId(\"{userId}\") }}";
			var results = await DB.FindAsync<PortalUserEntity>(query);
			var user = results.First();
			var userDO = user.ToDO();
			
			var queryObj = new SearchServiceQuery
			{
				Query = placeName,
				PortalUser = userDO
			};

			List<Place> result = await SearchSvc.SearchAsync(queryObj);
			return new ObjectResult(result);

			//CitySearchResponse results = await GeoNames.GetCityQueryAsync(placeName, 30);
			//return new ObjectResult(results.GeoNames);
		}		
	}
}