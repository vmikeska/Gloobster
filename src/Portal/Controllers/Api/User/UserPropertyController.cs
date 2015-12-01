using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Gloobster.Portal.Controllers.Api.User
{
	public class UserPropertyController: BaseApiController
	{
		public IGeoNamesService GeoNamesSvc { get; set; } 

		
		public UserPropertyController(IGeoNamesService geoNamesService, IDbOperations db) : base(db)
		{
			GeoNamesSvc = geoNamesService;
		}
		
		[HttpPut]
		[Authorize]
		public async Task<IActionResult> Put([FromBody] PropertyUpdateRequest request)
		{			
			var filter = DB.F<PortalUserEntity>().Eq(p => p.id, UserIdObj);
			UpdateDefinition<PortalUserEntity> update = null;

			if (request.propertyName == "HomeLocation")
			{
				var location = GetLocationSubEntity(request.values["sourceId"]);
				update = DB.U<PortalUserEntity>().Set(p => p.HomeLocation, location);			
			}

			if (request.propertyName == "CurrentLocation")
			{
				var location = GetLocationSubEntity(request.values["sourceId"]);
				update = DB.U<PortalUserEntity>().Set(p => p.CurrentLocation, location);				
			}

			if (request.propertyName == "Gender")
			{
				var gender = (Gender)int.Parse(request.values["gender"]);
				update = DB.U<PortalUserEntity>().Set(p => p.Gender, gender);				
			}

			if (request.propertyName == "DisplayName")
			{
				var name = request.values["name"];
				update = DB.U<PortalUserEntity>().Set(p => p.DisplayName, name);				
			}

			if (update != null)
			{
				await DB.UpdateAsync(filter, update);
			}			
			
			return new ObjectResult(null);
		}

		private CityLocationSE GetLocationSubEntity(string sourceId)
		{
			long geoNameId = long.Parse(sourceId);
			var city = GeoNamesSvc.GetCityById(geoNameId);

			var location = new CityLocationSE
			{
				City = city.Name,
				CountryCode = city.CountryCode,
				GeoNamesId = int.Parse(city.GID)
			};
			return location;
		}

	}
}