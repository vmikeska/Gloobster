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
		public IDbOperations DB { get; set; }
        public ILogger Log { get; set; }

        public PlaceController(ILogger log, ISearchService searchService, IDbOperations db) : base(db)
		{
			SearchSvc = searchService;
			DB = db;
            Log = log;
        }

		[HttpGet]
		[Authorize]
		public async Task<IActionResult> Get(SearchRequest req)
		{
            Log.Debug("PlaceLog: 1");

            var typesCol = ParseTypes(req.types);
            Log.Debug("PlaceLog: 2");
            //todo: this is possibly just because of FB access token, keep this token on client, not to query it every time			
            var user = DB.C<PortalUserEntity>().FirstOrDefault(u => u.id == UserIdObj);
            Log.Debug("PlaceLog: 3");
            var userDO = user.ToDO();
            Log.Debug("PlaceLog: 4");
            var queryObj = new SearchServiceQueryDO
			{
				Query = req.placeName,
				PortalUser = userDO,
				CustomProviders = typesCol,
                MustHaveCity = true,
                MustHaveCountry = true,
                LimitPerProvider = 5
			};
            Log.Debug("PlaceLog: 5");
            bool hasCoordinates = !string.IsNullOrEmpty(req.lat) && !string.IsNullOrEmpty(req.lng);
            Log.Debug("PlaceLog: 6");
            if (hasCoordinates)
			{
                Log.Debug("PlaceLog: 7");
                queryObj.Coordinates = new LatLng {Lat = float.Parse(req.lat, CultureInfo.InvariantCulture), Lng = float.Parse(req.lng, CultureInfo.InvariantCulture) };
			}
            Log.Debug("PlaceLog: 8");
            List<Place> result = await SearchSvc.SearchAsync(queryObj);
            Log.Debug("PlaceLog: 9");
            return new ObjectResult(result);			
		}

		private SourceType[] ParseTypes(string typesStr)
		{
			var types = typesStr.Split(',').Select(t => (SourceType) int.Parse(t)).ToArray();
			return types;
		}


		
	}	
}