using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels.Services.Trip;
using Gloobster.DomainModels.Trips;
using Gloobster.Entities;
using Gloobster.Entities.Trip;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Gloobster.Mappers;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Trip
{
	public class TripController : BaseApiController
	{
        public ITripDomain TripDomain { get; set; }

        public TripController(ITripDomain tripDomain, ILogger log, IDbOperations db) : base(log, db)
        {
            TripDomain = tripDomain;
        }

	    [HttpDelete]
	    [AuthorizeApi]
	    public async Task<IActionResult> Delete(string id)
	    {
	        bool res = true;

	        try
	        {
	            await TripDomain.DeleteTripAsync(id, UserId);
	        }
	        catch (Exception exc)
	        {
                Log.Error($"TripDomain.DeleteTripAsync: {exc.Message}");
	            res = false;
	        }
	        
            return new ObjectResult(res);
        }


	    [HttpGet]
		[AuthorizeApi]
		public async Task<IActionResult> Get(string id)
		{		    
			var tripIdObj = new ObjectId(id);
			var trip = DB.FOD<TripEntity>(t => t.id == tripIdObj);
			
			if (trip == null)
			{
				//throw not exists
				throw new NullReferenceException();
			}

			var tripResponse = trip.ToResponse();

		    var userIds = new List<ObjectId>();

			if (trip.Comments != null)
			{
				tripResponse.comments = tripResponse.comments.OrderByDescending(c => c.postDate).ToList();
			    userIds.AddRange(trip.Comments.Select(i => i.User_id));			    
			}

		    if (trip.Participants != null)
		    {
                tripResponse.participants.ForEach(p =>
                {
                    var usr = DB.FOD<UserEntity>(u => u.User_id == new ObjectId(p.userId));
                    p.name = usr.DisplayName;
                });
                userIds.AddRange(trip.Participants.Select(i => i.User_id));
            }
            
		    tripResponse.users = TripUtils.GetUsers(userIds, DB);

			return new ObjectResult(tripResponse);
		}
		
	}
}