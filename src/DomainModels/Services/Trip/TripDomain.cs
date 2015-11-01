using System.Collections.Generic;
using System.Linq;
using Gloobster.Database;
using Gloobster.Entities;
using Gloobster.Mappers;
using Gloobster.ReqRes.Trip;

namespace Gloobster.DomainModels.Services.Trip
{
	public class TripDomain
	{
		public static List<TripUsersResponse> GetCommentsUsers(List<CommentSE> comments, IDbOperations db)
		{
			var commentsUsersIds = comments.Select(c => c.PortalUser_id);
			var commentsUsers = db.C<PortalUserEntity>().Where(u => commentsUsersIds.Contains(u.id)).ToList();
			var commentsUsersResponse = commentsUsers.Select(u => u.ToResponse()).ToList();
			return commentsUsersResponse;
		}
	}
}