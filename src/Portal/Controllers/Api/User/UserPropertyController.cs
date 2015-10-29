using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Common.DbEntity.PortalUser;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;

namespace Gloobster.Portal.Controllers.Api.User
{
	public class UserPropertyController: BaseApiController
	{
		public IGeoNamesService GeoNamesSvc { get; set; } 

		
		public UserPropertyController(IGeoNamesService geoNamesService, IDbOperations db) : base(db)
		{
			GeoNamesSvc = geoNamesService;
		}

		//todo: change to put
		[HttpPost]
		[Authorize]
		public async Task<IActionResult> Put([FromBody] PropertyUpdateRequest request, string userId)
		{
			var userIdObj = new ObjectId(userId);
			var portalUser = DB.C<PortalUserEntity>().First(p => p.id == userIdObj);

			if (request.propertyName == "HomeLocation")
			{
				long geoNameId = long.Parse(request.values["sourceId"]);
				var city = await GeoNamesSvc.GetCityByIdAsync(geoNameId);

				portalUser.HomeLocation = new CityLocationSE
				{
					City = city.Name,
					CountryCode = city.CountryCode,
					GeoNamesId = city.GeonameId
				};				
			}

			await DB.ReplaceOneAsync(portalUser);
			
			return new ObjectResult(null);
		}

	}

	public class PropertyUpdateRequest
	{
		public string propertyName { get; set; }
		public Dictionary<string, string> values { get; set; }
	}
}