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
				var countryCode3 = GV("countryCode");
				var country = CountryService.GetCountryByCountryCode3(countryCode3);
				bool selected = bool.Parse(GV("selected"));
				Planning.ChangeCountrySelection(UserId, country.CountryCode, selected);
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

				var resp = new PlanningAnytimeResponse
				{
					countryCodes = anytime.CountryCodes.Select(c =>
					{
						var country = CountryService.GetCountryByCountryCode2(c);
						return country.IsoAlpha3;
					}).ToList()
				};

				response = resp;
				//anytime.ToResponse();
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