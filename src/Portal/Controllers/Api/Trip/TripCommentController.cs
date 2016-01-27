using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainModels.Services.Trip;
using Gloobster.Entities;
using Gloobster.Entities.Trip;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Trip;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Trip
{
	public class TripCommentController : BaseApiController
	{
        
		[HttpPost]
		[Authorize]
		public async Task<IActionResult> Post([FromBody]NewCommentRequest request)
		{			
			var tripIdObj = new ObjectId(request.tripId);
			
			var trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);

			if (trip == null)
			{
				//throw not exists
				throw new NullReferenceException();
			}

			var newComment = new CommentSE
			{                
				PortalUser_id = UserIdObj,
				PostDate = DateTime.UtcNow,
				Text = request.text
			};
			
			var filter = DB.F<TripEntity>().Eq(p => p.id, tripIdObj);
			var update = DB.U<TripEntity>().Push(p => p.Comments, newComment);
			await DB.UpdateAsync(filter, update);
            
            trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);
            
            var response = new NewCommentResponse
			{
				comments = trip.Comments.Select(c => c.ToResponse()).OrderByDescending(c => c.postDate).ToList(),
				users = TripDomain.GetUsers(trip.Comments.Select(u => u.PortalUser_id).ToList(), DB)
			};
			
			return new ObjectResult(response);
		}

	    public TripCommentController(ILogger log, IDbOperations db) : base(log, db)
	    {
	    }
	}
}