using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainModels.Services.Trip;
using Gloobster.Entities;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Trip;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;

namespace Gloobster.Portal.Controllers.Api.Trip
{
	public class TripCommentController : BaseApiController
	{

		public TripCommentController(IDbOperations db) : base(db)
		{

		}

		[HttpPost]
		[Authorize]
		public async Task<IActionResult> Post([FromBody]NewCommentRequest request, string userId)
		{
			//todo: change to $push
			var tripIdObj = new ObjectId(request.tripId);
			var userIdObj = new ObjectId(userId);
			
			var trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);

			if (trip == null)
			{
				//throw not exists
				throw new NullReferenceException();
			}

			var newComment = new CommentSE
			{
				PortalUser_id = userIdObj,
				PostDate = DateTime.UtcNow,
				Text = request.text
			};

			if (trip.Comments == null)
			{
				trip.Comments = new List<CommentSE>();
			}

			trip.Comments.Add(newComment);

			await DB.ReplaceOneAsync(trip);

			var response = new NewCommentResponse
			{
				comments = trip.Comments.Select(c => c.ToResponse()).OrderByDescending(c => c.postDate).ToList(),
				users = TripDomain.GetCommentsUsers(trip.Comments, DB)
			};
			
			return new ObjectResult(response);
		}
		
	}
}