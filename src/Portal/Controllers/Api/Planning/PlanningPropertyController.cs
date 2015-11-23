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
		public ICountryService CountryService { get; set; }

		public PlanningPropertyController(ICountryService countryService, IPlanningDomain planning, IDbOperations db) : base(db)
		{			
			DB = db;
			Planning = planning;
			CountryService = countryService;
		}

		private PlanningPropRequest Req;

		[HttpPut]
		[Authorize]
		public IActionResult Put([FromBody]PlanningPropRequest req)
		{
			Req = req;

			if (req.planningType == PlanningType.Anytime)
			{
				if (req.propertyName == "cities")
				{
					var gid = int.Parse(GV("gid"));
					bool selected = bool.Parse(GV("selected"));
					Planning.ChangeCitySelection(UserId, gid, selected);
				}

				if (req.propertyName == "countries")
				{
					var countryCode = GV("countryCode");
					bool selected = bool.Parse(GV("selected"));
					Planning.ChangeCountrySelection(UserId, countryCode, selected);
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