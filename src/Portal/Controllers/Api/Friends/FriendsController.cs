using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
using Gloobster.Common.DbEntity.PortalUser;
using Gloobster.DomainModels.Services.Facebook.FriendsExtractor;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;

namespace Gloobster.Portal.Controllers.Api.Friends
{
	public class FriendsController : BaseApiController
	{
		public IFacebookFriendsService FbFriendsService { get; set; }
		public IFriendsDomain FriendsDoimain { get; set; }

		public FriendsController(IFacebookFriendsService fbFriendsService, IFriendsDomain friendsDoimain, IDbOperations db) : base(db)
		{
			FbFriendsService = fbFriendsService;
			FriendsDoimain = friendsDoimain;
		}

		[HttpGet]
		[Authorize]
		public IActionResult Get(string userId)
		{
			var response = GetFriends(userId);
			
			return new ObjectResult(response);
		}
		
		[HttpPost]
		[Authorize]
		public IActionResult Post([FromBody] FriendActionRequest request, string userId)
		{			
			if (request.action == FriendActionType.Request)
			{
				FriendsDoimain.RequestFriendship(userId, request.friendId);
			}

			if (request.action == FriendActionType.Confirm)
			{
				FriendsDoimain.ConfirmFriendship(userId, request.friendId);
			}

			if (request.action == FriendActionType.Unfriend)
			{
				FriendsDoimain.Unfriend(userId, request.friendId);
			}

			//todo: cancel request
			//todo: block
			
			var response = GetFriends(userId);

			return new ObjectResult(response);
		}


		private FriendsResponse GetFriends(string userId)
		{
			var userIdObj = new ObjectId(userId);

			var friendsEntity = DB.C<FriendsEntity>().FirstOrDefault(f => f.PortalUser_id == userIdObj);

			var allInvolvedUserIds = GetAllInvolvedUserIds(friendsEntity);

			var friends = DB.C<PortalUserEntity>().Where(u => allInvolvedUserIds.Contains(u.id)).ToList();

			var fbFriends = FbFriendsService.GetFriends(userId);
			var fbFriendsFiltered = fbFriends.Where(f =>
				!friendsEntity.Friends.Contains(new ObjectId(f.UserId)) &&
				!friendsEntity.Proposed.Contains(new ObjectId(f.UserId)) &&
				!friendsEntity.AwaitingConfirmation.Contains(new ObjectId(f.UserId))
			).ToList();

			var response = new FriendsResponse
			{
				Friends = friendsEntity.Friends.Select(f => ConvertResponse(f, friends)).ToList(),
				AwaitingConfirmation = friendsEntity.AwaitingConfirmation.Select(f => ConvertResponse(f, friends)).ToList(),
				Blocked = friendsEntity.Blocked.Select(f => ConvertResponse(f, friends)).ToList(),
				Proposed = friendsEntity.Proposed.Select(f => ConvertResponse(f, friends)).ToList(),
				FacebookRecommended = fbFriendsFiltered.Select(f => new FriendResponse { FriendId = f.UserId, PhotoUrl = f.ProfileImage, DisplayName = f.DisplayName }).ToList()
			};

			return response;
		}



		private List<ObjectId> GetAllInvolvedUserIds(FriendsEntity friendsEntity)
		{
			var friendsIds = new List<ObjectId>();
			friendsIds.AddRange(friendsEntity.AwaitingConfirmation);
			friendsIds.AddRange(friendsEntity.Blocked);
			friendsIds.AddRange(friendsEntity.Friends);
			friendsIds.AddRange(friendsEntity.Proposed);
			friendsIds = friendsIds.Distinct().ToList();
			return friendsIds;
		}

		private FriendResponse ConvertResponse(ObjectId friendId, List<PortalUserEntity> portalUsers)
		{
			var portalUser = portalUsers.FirstOrDefault(u => u.id == friendId);

			var friend = new FriendResponse
			{
				FriendId = friendId.ToString(),
				PhotoUrl = portalUser.ProfileImage,
				DisplayName = portalUser.DisplayName
			};

			return friend;
		}
		
	}

	public enum FriendActionType { Confirm, Request, Unfriend, Block, CancelRequest }

	public class FriendActionRequest
	{
		public string friendId { get; set; }
		public FriendActionType action { get; set; }
	}

}