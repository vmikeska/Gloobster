using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities.Planning;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Planning;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Planning
{
	[Route("api/[controller]")]
	public class PlanningPropertyController : BaseApiController
	{						
		public IPlanningDomain Planning { get; set; }
		
		public PlanningPropertyController(IPlanningDomain planning, ILogger log, IDbOperations db) : base(log, db)
		{			
			DB = db;
			Planning = planning;			
		}

		private PlanningPropRequest Req;

		[HttpPost]
		[AuthorizeApi]
		public async Task<IActionResult> Post([FromBody] PlanningPropRequest req)
		{
			Req = req;

			if (req.planningType == PlanningType.Custom)
			{
				if (req.propertyName == "time")
				{
					string kind = GV("kind");
					int value = int.Parse(GV("value"));
					string searchId = GV("id");

					if (kind == "year")
					{
						bool success = await Planning.PushCustomProperty(UserId, searchId, "Years", value);
						return new ObjectResult(success);
					}

					if (kind == "month")
					{
						bool success = await Planning.PushCustomProperty(UserId, searchId, "Months", value);
						return new ObjectResult(success);
					}
				}

				if (req.propertyName == "fromAirports")
				{
					string searchId = GV("id");
					int value = int.Parse(GV("value"));
					string text = GV("text");

                    //todo: check on functionality, was broken by refactoring in Fly
					var airport = new AirportSaveSE
					{
						OrigId = value,
                        City = text
					};

					bool success = await Planning.PushCustomProperty(UserId, searchId, "FromAirports", airport);
					return new ObjectResult(success);
				}

				if (req.propertyName == "createNewSearch")
				{
					string name = GV("searchName");
					var searchDo = await Planning.CreateNewEmptySearch(UserId, name);
					var searchResponse = searchDo.ToResponse();
					return new ObjectResult(searchResponse);
				}
			}

			return new ObjectResult(null);
		}


		[HttpPut]
		[AuthorizeApi]
		public async Task<IActionResult> Put([FromBody] PlanningPropRequest req)
		{
			Req = req;

			if (req.propertyName == "ExtraDaysLength")
			{
				int length = int.Parse(GV("length"));
				var success = await Planning.ChangeWeekendExtraDaysLength(UserId, length);
				return new ObjectResult(success);
			}

			if (req.propertyName == "roughlyDays")
			{
				int days = int.Parse(GV("days"));
				string searchId = GV("id");
				var success = await Planning.UpdateCustomProperty(UserId, searchId, "RoughlyDays", days);
				return new ObjectResult(success);
			}

			if (req.propertyName == "renameSearch")
			{
				string searchName = GV("searchName");
				string searchId = GV("id");
				var success = await Planning.UpdateCustomProperty(UserId, searchId, "SearchName", searchName);
				return new ObjectResult(success);
			}


			if (req.propertyName == "cities")
			{
				var selection = new CitySelectionDO
				{
					UserId = UserId,
					GID = int.Parse(GV("gid")),
					Selected = bool.Parse(GV("selected")),
					PlanningType = req.planningType
				};

				if (req.planningType == PlanningType.Custom)
				{
					selection.CustomId = GV("customId");
				}

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

				if (req.planningType == PlanningType.Custom)
				{
					selection.CustomId = GV("customId");
				}

				bool success = await Planning.ChangeCountrySelection(selection);
				return new ObjectResult(success);
			}
			
			return new ObjectResult(null);
		}

		[HttpGet]
		[AuthorizeApi]
		public IActionResult Get(PlanningType planningType)
		{
			object response = null;

			if (planningType == PlanningType.Anytime)
			{
				var anytime = DB.FOD<PlanningAnytimeEntity>(p => p.User_id == UserIdObj);
				if (anytime == null)
				{
					return null;
				}
				
				response = anytime.ToResponse();
			}

			if (planningType == PlanningType.Weekend)
			{
				var weekend = DB.FOD<PlanningWeekendEntity>(p => p.User_id == UserIdObj);
				if (weekend == null)
				{
					return null;
				}

				response = weekend.ToResponse();
			}

			if (planningType == PlanningType.Custom)
			{
				var custom = DB.FOD<PlanningCustomEntity>(p => p.User_id == UserIdObj);
				if (custom == null)
				{
					return null;
				}

				response = custom.ToResponse();
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