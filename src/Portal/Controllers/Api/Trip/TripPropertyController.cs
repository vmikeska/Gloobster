using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Trip
{
	public class TripPropertyController: BaseApiController
	{
		
		
		[HttpPut]
		[Authorize]
		public async Task<IActionResult> Put([FromBody] PropertyUpdateRequest request)
		{
			var tripIdObj = new ObjectId(request.values["id"]);
			var filter = DB.F<TripEntity>().Eq(p => p.id, tripIdObj);
			UpdateDefinition<TripEntity> update = null;
		    object response = null;
			
			if (request.propertyName == "Name")
			{				
				update = DB.U<TripEntity>().Set(p => p.Name, request.values["name"]);				
			}

			if (request.propertyName == "Description")
			{
				update = DB.U<TripEntity>().Set(p => p.Description, request.values["description"]);
			}

			if (request.propertyName == "Notes")
			{
				update = DB.U<TripEntity>().Set(p => p.Notes, request.values["notes"]);
			}

			if (request.propertyName == "NotesPublic")
			{
				bool isPublic = bool.Parse(request.values["isPublic"]);
				update = DB.U<TripEntity>().Set(p => p.NotesPublic, isPublic);
			}

            if (request.propertyName == "FriendsPublic")
            {
                bool state = bool.Parse(request.values["state"]);
                update = DB.U<TripEntity>().Set(p => p.FriendsPublic, state);
            }

            if (request.propertyName == "AllowToRequestJoin")
            {
                bool state = bool.Parse(request.values["state"]);
                update = DB.U<TripEntity>().Set(p => p.AllowToRequestJoin, state);
            }

            if (request.propertyName == "ShareByCode")
            {
                bool state = bool.Parse(request.values["state"]);
                string code = null;
                if (state)
                {
                    code = Guid.NewGuid().ToString().Replace("-", "");
                }

                update = DB.U<TripEntity>().Set(p => p.SharingCode, code);
                response = code;
            }
            
            if (update != null)
			{
				var res = await DB.UpdateAsync(filter, update);
			}

			return new ObjectResult(response);
		}

	    public TripPropertyController(ILogger log, IDbOperations db) : base(log, db)
	    {
	    }
	}

}