using System.Collections.Generic;
using System.Linq;
using Gloobster.Database;
using Gloobster.Entities;
using Gloobster.Entities.Trip;
using Gloobster.Mappers;
using Gloobster.ReqRes.Trip;
using MongoDB.Bson;

namespace Gloobster.DomainModels.Services.Trip
{
	public class TripHelper
	{
        public static List<TripUsersResponse> GetUsers(List<ObjectId> ids, IDbOperations db)
        {
			var commentsUsers = db.List<UserEntity>(u => ids.Contains(u.User_id)).ToList();
			var commentsUsersResponse = commentsUsers.Select(u => u.ToResponse()).ToList();
			return commentsUsersResponse;
		}
        
    }
}