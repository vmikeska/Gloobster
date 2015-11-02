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
		[HttpPut]
		[Authorize]
		public async Task<IActionResult> Put([FromBody] PropertyUpdateRequest request, string userId)
		{
			var userIdObj = new ObjectId(userId);
			var portalUser = DB.C<PortalUserEntity>().First(p => p.id == userIdObj);

			if (request.propertyName == "HomeLocation")
			{
				portalUser.HomeLocation = await GetLocationSubEntity(request.values["sourceId"]);
			}

			if (request.propertyName == "CurrentLocation")
			{
				portalUser.CurrentLocation = await GetLocationSubEntity(request.values["sourceId"]);
			}

			if (request.propertyName == "Gender")
			{
				var gender = (Gender)int.Parse(request.values["gender"]);
				portalUser.Gender = gender;
			}

			if (request.propertyName == "DisplayName")
			{
				var name = request.values["name"];
				portalUser.DisplayName = name;
			}

			await DB.ReplaceOneAsync(portalUser);
			
			return new ObjectResult(null);
		}

		private async Task<CityLocationSE> GetLocationSubEntity(string sourceId)
		{
			long geoNameId = long.Parse(sourceId);
			var city = await GeoNamesSvc.GetCityByIdAsync(geoNameId);

			var location = new CityLocationSE
			{
				City = city.Name,
				CountryCode = city.CountryCode,
				GeoNamesId = city.GeonameId
			};
			return location;
		}

	}
}