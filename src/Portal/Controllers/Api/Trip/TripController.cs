using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainModels.Services.Trip;
using Gloobster.Entities;
using Gloobster.Entities.Trip;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Gloobster.Mappers;

namespace Gloobster.Portal.Controllers.Api.Trip
{
	public class TripController : BaseApiController
	{

		public TripController(IDbOperations db) : base(db)
		{
			
		}

		[HttpGet]
		[Authorize]
		public async Task<IActionResult> Get(string id)
		{
			var tripIdObj = new ObjectId(id);
			var trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);
			
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
			    userIds.AddRange(trip.Comments.Select(i => i.PortalUser_id));			    
			}

		    if (trip.Participants != null)
		    {
                tripResponse.participants.ForEach(p =>
                {
                    var usr = DB.C<PortalUserEntity>().FirstOrDefault(u => u.id == new ObjectId(p.userId));
                    p.name = usr.DisplayName;
                });
                userIds.AddRange(trip.Participants.Select(i => i.PortalUser_id));
            }
            
		    tripResponse.users = TripDomain.GetUsers(userIds, DB);

			return new ObjectResult(tripResponse);
		}
		
	}
}