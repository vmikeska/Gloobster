using System.Linq;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.ReqRes.Trip;
using MongoDB.Bson;
using Gloobster.Enums;

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
		

		public static ParticipantDO ToDO(this ParticipantRequest request, ParticipantState? state = null)
		{
			if (!state.HasValue)
			{
				state = ParticipantState.Invited;
			}

			return new ParticipantDO
			{
				UserId = request.userId,
				IsAdmin = request.isAdmin,
				State = state.Value
			};
		}

		public static ParticipantSE ToEntity(this ParticipantDO dObj)
		{
			var entity = new ParticipantSE
			{
				PortalUser_id = new ObjectId(dObj.UserId),
				State = dObj.State,
				IsAdmin = dObj.IsAdmin
			};

			return entity;
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

			if (entity.Files != null)
			{
				request.files = entity.Files.Select(c => c.ToResponse()).ToList();
			}

			return request;
		}

		public static FileResponse ToResponse(this FileSE entity)
		{
			var response = new FileResponse
			{
				originalFileName = entity.OriginalFileName,
				savedFileName = entity.SavedFileName,
				ownerId = entity.PortalUser_id.ToString()
			};

			return response;
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