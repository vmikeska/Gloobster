using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities.SearchEngine;
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
	public class SelCountryController : BaseApiController
	{						
		public IPlanningDomain Planning { get; set; }
		
		public SelCountryController(IPlanningDomain planning, ILogger log, IDbOperations db) : base(log, db)
		{			
			DB = db;
			Planning = planning;			
		}

		
		[HttpPut]
		[AuthorizeApi]
		public async Task<IActionResult> Put([FromBody] SelCountryRequest req)
		{
            var selection = new CountrySelectionDO
			{
				UserId = UserId,
				CountryCode = req.cc,
				Selected = req.selected,
				PlanningType = req.type,
                CustomId = req.customId                
			};
            
            bool success = await Planning.ChangeCountrySelection(selection);
			return new ObjectResult(success);			
		}

		[HttpGet]
		[AuthorizeApi]
		public IActionResult Get(PlanningType type, string customId)
		{
		    var ccs = new List<string>();
            
            if (type == PlanningType.Anytime)
			{
				var anytime = DB.FOD<DealsAnytimeEntity>(p => p.User_id == UserIdObj);
				if (anytime == null)
				{
					return null;
				}

			    ccs = anytime.CountryCodes;
			}

			if (type == PlanningType.Weekend)
			{
				var weekend = DB.FOD<DealsWeekendEntity>(p => p.User_id == UserIdObj);
				if (weekend == null)
				{
					return null;
				}

                ccs = weekend.CountryCodes;
            }

            if (type == PlanningType.Custom)
            {
                var custom = DB.FOD<DealsCustomEntity>(p => p.User_id == UserIdObj);
                if (custom == null)
                {
                    return null;
                }

                var sid = new ObjectId(customId);
                var search = custom.Searches.FirstOrDefault(s => s.id == sid);

                ccs = search.CCs;                
            }

            return new ObjectResult(ccs);
		}
		
	}
}