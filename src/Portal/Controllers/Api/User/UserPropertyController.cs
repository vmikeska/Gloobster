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
using Serilog;

namespace Gloobster.Portal.Controllers.Api.User
{
	public class UserPropertyController: BaseApiController
	{
		public IGeoNamesService GeoNamesSvc { get; set; } 

		
		public UserPropertyController(IGeoNamesService geoNamesService, ILogger log, IDbOperations db) : base(log, db)
		{
			GeoNamesSvc = geoNamesService;
		}
		
		[HttpPut]
		[AuthorizeApi]
		public async Task<IActionResult> Put([FromBody] PropertyUpdateRequest request)
		{			
			var filter = DB.F<UserEntity>().Eq(p => p.User_id, UserIdObj);
			UpdateDefinition<UserEntity> update = null;

			if (request.propertyName == "HomeLocation")
			{
				var location = await GetLocationSubEntity(request.values["sourceId"]);
				update = DB.U<UserEntity>().Set(p => p.HomeLocation, location);
			}

			if (request.propertyName == "CurrentLocation")
			{
				var location = await GetLocationSubEntity(request.values["sourceId"]);
				update = DB.U<UserEntity>().Set(p => p.CurrentLocation, location);
			}

			if (request.propertyName == "Gender")
			{
				var gender = (Gender)int.Parse(request.values["gender"]);
				update = DB.U<UserEntity>().Set(p => p.Gender, gender);				
			}

            if (request.propertyName == "FamilyStatus")
            {
                var status = (FamilyStatus)int.Parse(request.values["status"]);
                update = DB.U<UserEntity>().Set(p => p.FamilyStatus, status);
            }

            if (request.propertyName == "BirthYear")
            {
                var ys = request.values["year"];

                int? year = null;
                int y = 0;
                if (int.TryParse(ys, out y) )
                {
                    year = int.Parse(ys);
                }
                
                update = DB.U<UserEntity>().Set(p => p.BirthYear, year);
            }
            
            if (request.propertyName == "DisplayName")
			{
				var name = request.values["name"];
				update = DB.U<UserEntity>().Set(p => p.DisplayName, name);				
			}

            if (request.propertyName == "FirstName")
            {
                var name = request.values["name"];
                update = DB.U<UserEntity>().Set(p => p.FirstName, name);
            }

            if (request.propertyName == "LastName")
            {
                var name = request.values["name"];
                update = DB.U<UserEntity>().Set(p => p.LastName, name);
            }

            if (request.propertyName == "ShortDescription")
            {
                var text = request.values["text"];
                update = DB.U<UserEntity>().Set(p => p.ShortDescription, text);
            }
            
            if (request.propertyName == "Langs")
            {
                var value = request.values["value"];
                var action = request.values["action"];

                if (action == "ADD")
                {
                    update = DB.U<UserEntity>().Push(p => p.Languages, value);
                }

                if (action == "DEL")
                {
                    update = DB.U<UserEntity>().Pull(p => p.Languages, value);
                }                
            }

            if (request.propertyName == "Inters")
            {
                var value = int.Parse(request.values["value"]);
                var action = request.values["action"];

                if (action == "ADD")
                {
                    update = DB.U<UserEntity>().Push(p => p.Interests, value);
                }

                if (action == "DEL")
                {
                    update = DB.U<UserEntity>().Pull(p => p.Interests, value);
                }
            }




            if (update != null)
			{
				var res = await DB.UpdateAsync(filter, update);
			}			
			
			return new ObjectResult(null);
		}

		private async Task<CityLocationSE> GetLocationSubEntity(string sourceId)
		{
			int geoNameId = int.Parse(sourceId);
			var city = await GeoNamesSvc.GetCityByIdAsync(geoNameId);

			var location = new CityLocationSE
			{
				City = city.Name,
				CountryCode = city.CountryCode,
				GeoNamesId = city.GID
			};
			return location;
		}

	}
}