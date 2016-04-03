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
using Gloobster.ReqRes;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Geo
{
	[Route("api/[controller]")]
	public class PlaceController : BaseApiController
	{				
		public ISearchService SearchSvc { get; set; }		
        
        public PlaceController(ISearchService searchService, ILogger log, IDbOperations db) : base(log, db)
		{
			SearchSvc = searchService;
			DB = db;
            Log = log;
        }

		[HttpGet]
		[AuthorizeApi]
		public async Task<IActionResult> Get(SearchRequest req)
		{
            var typesCol = ParseTypes(req.types);
         
            var queryObj = new SearchServiceQueryDO
			{
				Query = req.placeName,				
				CustomProviders = typesCol,
                MustHaveCity = true,
                MustHaveCountry = true,
                LimitPerProvider = 5,
                FbToken = req.fbt
			};
         
            bool hasCoordinates = !string.IsNullOrEmpty(req.lat) && !string.IsNullOrEmpty(req.lng);
         
            if (hasCoordinates)
			{
         
                queryObj.Coordinates = new LatLng
                {
                    Lat = float.Parse(req.lat, CultureInfo.InvariantCulture),
                    Lng = float.Parse(req.lng, CultureInfo.InvariantCulture)
                };
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
}