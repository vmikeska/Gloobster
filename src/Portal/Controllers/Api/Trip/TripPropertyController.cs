using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;

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
			var trip = DB.C<TripEntity>().First(t => t.id == tripIdObj);

			if (request.propertyName == "Name")
			{
				trip.Name = request.values["name"];
			}

			await DB.ReplaceOneAsync(trip);
			
			return new ObjectResult(null);
		}
		
	}

}