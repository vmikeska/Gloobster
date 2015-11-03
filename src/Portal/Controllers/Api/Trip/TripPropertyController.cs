using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Gloobster.Portal.Controllers.Api.Trip
{
	public class TripPropertyController: BaseApiController
	{
		
		public TripPropertyController(IDbOperations db) : base(db)
		{			
		}
		
		[HttpPut]
		[Authorize]
		public async Task<IActionResult> Put([FromBody] PropertyUpdateRequest request, string userId)
		{
			var userIdObj = new ObjectId(userId);
			var tripIdObj = new ObjectId(request.values["id"]);
			var filter = DB.F<TripEntity>().Eq(p => p.id, tripIdObj);
			UpdateDefinition<TripEntity> update = null;
			
			if (request.propertyName == "Name")
			{				
				update = DB.U<TripEntity>().Set(p => p.Name, request.values["name"]);				
			}

			if (update != null)
			{
				var res = await DB.UpdateAsync(filter, update);
			}

			return new ObjectResult(null);
		}
		
	}

}