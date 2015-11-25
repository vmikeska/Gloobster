using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities.Planning;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Planning;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;

namespace Gloobster.Portal.Controllers.Api.Planning
{
	[Route("api/[controller]")]
	public class PlanningPropertyController : BaseApiController
	{				
		public IDbOperations DB { get; set; }
		public IPlanningDomain Planning { get; set; }
		
		public PlanningPropertyController(IPlanningDomain planning, IDbOperations db) : base(db)
		{			
			DB = db;
			Planning = planning;			
		}

		private PlanningPropRequest Req;

		[HttpPut]
		[Authorize]
		public async Task<IActionResult> Put([FromBody]PlanningPropRequest req)
		{
			Req = req;

			if (req.planningType == PlanningType.Weekend)
			{
				if (req.propertyName == "ExtraDaysLength")
				{
					int length = int.Parse(GV("length"));
                    var success = await Planning.ChangeWeekendExtraDaysLength(UserId, length);
					return new ObjectResult(success);
				}	
			}

			if (req.planningType == PlanningType.Anytime || req.planningType == PlanningType.Weekend)
			{
				if (req.propertyName == "cities")
				{
					var selection = new CitySelectionDO
					{
						UserId = UserId,
						GID = int.Parse(GV("gid")),
						Selected = bool.Parse(GV("selected")),
						PlanningType = req.planningType
					};
					bool success = await Planning.ChangeCitySelection(selection);
					return new ObjectResult(success);
				}

				if (req.propertyName == "countries")
				{										
					var selection = new CountrySelectionDO
					{
						UserId = UserId,
						CountryCode = GV("countryCode"),
                        Selected = bool.Parse(GV("selected")),
						PlanningType = req.planningType
					};
					bool success = await Planning.ChangeCountrySelection(selection);
					return new ObjectResult(success);
				}
			}
			
			return new ObjectResult(null);
		}

		[HttpGet]
		[Authorize]
		public IActionResult Get(PlanningType planningType)
		{
			//todo: temp remove then
			Planning.CreateDBStructure(UserId);

			object response = null;

			if (planningType == PlanningType.Anytime)
			{
				var anytime = DB.C<PlanningAnytimeEntity>().FirstOrDefault(p => p.PortalUser_id == UserIdObj);
				if (anytime == null)
				{
					return null;
				}
				
				response = anytime.ToResponse();
			}

			if (planningType == PlanningType.Weekend)
			{
				var weekend = DB.C<PlanningWeekendEntity>().FirstOrDefault(p => p.PortalUser_id == UserIdObj);
				if (weekend == null)
				{
					return null;
				}

				response = weekend.ToResponse();
			}

			return new ObjectResult(response);
		}
		

		private string GV(string valueName)
		{
			if (!Req.values.ContainsKey(valueName))
			{
				throw new Exception($"Missing property: '{valueName}'");
			}

			var val = Req.values[valueName];
			return val;
		}
	}
}