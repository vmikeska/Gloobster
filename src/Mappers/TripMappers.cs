using System.Linq;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.ReqRes.Trip;
using MongoDB.Bson;

namespace Gloobster.Mappers
{
	public static class TripMappers
	{
		public static TripUsersResponse ToResponse(this PortalUserEntity entity)
		{
			var request = new TripUsersResponse
			{
				id = entity.id.ToString(),
				displayName = entity.DisplayName,
				photoUrl = entity.ProfileImage
			};

			return request;
		}

		public static TripResponse ToResponse(this TripEntity entity)
		{
			var request = new TripResponse
			{
				tripId = entity.id.ToString(),
				name = entity.Name,
				createdDate = entity.CreatedDate,
				ownerId = entity.PortalUser_id.ToString()
			};

			if (entity.Comments != null)
			{
				request.comments = entity.Comments.Select(c => c.ToResponse()).ToList();
			}

			return request;
		}

		public static CommentResponse ToResponse(this CommentSE entity)
		{
			var request = new CommentResponse
			{
				userId = entity.PortalUser_id.ToString(),
				postDate = entity.PostDate,
				text = entity.Text
			};
			return request;
		}

		//public static FriendsDO ToDO(this FriendsEntity entity)
		//{
		//	if (entity == null)
		//	{
		//		return null;
		//	}

		//	var dObj = new FriendsDO
		//	{
		//		id = entity.id.ToString(),
		//		UserId = entity.PortalUser_id.ToString(),
		//		Friends = entity.Friends.Select(f => f.ToString()).ToList(),
		//		AwaitingConfirmation = entity.AwaitingConfirmation.Select(f => f.ToString()).ToList(),
		//		Proposed = entity.Proposed.Select(f => f.ToString()).ToList(),
		//		Blocked = entity.Blocked.Select(f => f.ToString()).ToList()
		//	};

		//	return dObj;
		//}

		//public static FriendsEntity ToEntity(this FriendsDO dObj)
		//{
		//	if (dObj == null)
		//	{
		//		return null;
		//	}

		//	var entity = new FriendsEntity
		//	{
		//		PortalUser_id = new ObjectId(dObj.UserId),
		//		Friends = dObj.Friends.Select(f => new ObjectId(f)).ToList(),
		//		AwaitingConfirmation = dObj.AwaitingConfirmation.Select(f => new ObjectId(f)).ToList(),
		//		Proposed = dObj.Proposed.Select(f => new ObjectId(f)).ToList(),
		//		Blocked = dObj.Blocked.Select(f => new ObjectId(f)).ToList()
		//	};

		//	return entity;
		//}
	}
}