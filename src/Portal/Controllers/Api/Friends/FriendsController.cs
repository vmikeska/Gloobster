using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Friends;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Friends
{
	public class FriendsController : BaseApiController
	{
		public IFacebookFriendsService FbFriendsService { get; set; }
		public IFriendsDomain FriendsDoimain { get; set; }
        public IEntitiesDemandor Demandor { get; set; }

        public FriendsController(IEntitiesDemandor demandor, IFacebookFriendsService fbFriendsService, IFriendsDomain friendsDoimain, ILogger log, IDbOperations db) : base(log, db)
		{
			FbFriendsService = fbFriendsService;
			FriendsDoimain = friendsDoimain;
            Demandor = demandor;
		}		

		[HttpGet]
		[AuthorizeApi]
		public IActionResult Get()
		{
			var response = GetFriends(UserId);

			return new ObjectResult(response);
		}

		[HttpPost]
		[AuthorizeApi]
		public async Task<IActionResult> Post([FromBody] FriendActionRequest request)
		{			
			if (request.action == FriendActionType.Request)
			{
				await FriendsDoimain.RequestFriendship(UserId, request.friendId);
			}

			if (request.action == FriendActionType.Confirm)
			{
                await FriendsDoimain.ConfirmFriendship(UserId, request.friendId);
			}

			if (request.action == FriendActionType.Unfriend)
			{
                await FriendsDoimain.Unfriend(UserId, request.friendId);
			}

		    if (request.action == FriendActionType.CancelRequest)
		    {
                await FriendsDoimain.CancelRequest(UserId, request.friendId);
		    }

            if (request.action == FriendActionType.Block)
            {
                await FriendsDoimain.Block(UserId, request.friendId);
            }

            var response = GetFriends(UserId);

			return new ObjectResult(response);
		}


		private FriendsResponse GetFriends(string userId)
		{
			var userIdObj = new ObjectId(userId);

			var friendsEntity = DB.FOD<FriendsEntity>(f => f.User_id == userIdObj);

			var allInvolvedUserIds = GetAllInvolvedUserIds(friendsEntity);

			var friends = DB.List<UserEntity>(u => allInvolvedUserIds.Contains(u.User_id));

			var fbFriendsFiltered = GetFbFriends(userId, friendsEntity);

			var response = new FriendsResponse
			{
				Friends = friendsEntity.Friends.Select(f => ConvertResponse(f, friends)).ToList(),
				AwaitingConfirmation = friendsEntity.AwaitingConfirmation.Select(f => ConvertResponse(f, friends)).ToList(),
				Blocked = friendsEntity.Blocked.Select(f => ConvertResponse(f, friends)).ToList(),
				Proposed = friendsEntity.Proposed.Select(f => ConvertResponse(f, friends)).ToList(),
				FacebookRecommended = fbFriendsFiltered.Select(f => new FriendResponse { friendId = f.UserId, displayName = f.DisplayName }).ToList()
			};

		    Log.Debug($"FriendsResponseTest: {response.Friends.Count}, {response.AwaitingConfirmation.Count}, {response.FacebookRecommended.Count}");

			return response;
		}

		private List<UserDO> GetFbFriends(string userId, FriendsEntity friends)
		{
			var result = new List<UserDO>();

		    try
		    {                
		        var fbFriends = FbFriendsService.GetFriends(userId);
		        if (fbFriends != null)
		        {
		            result = fbFriends.Where(f =>
		            {
		                var userIdObj = new ObjectId(f.UserId);
		                return !friends.Friends.Contains(userIdObj) &&
		                       !friends.Proposed.Contains(userIdObj) &&
		                       !friends.AwaitingConfirmation.Contains(userIdObj);
		            }).ToList();
		        }                
		    }
		    catch (Exception exc)
		    {
		        Log.Error("GetFbFriends: " + exc.Message);
		    }

            return result;
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

		private FriendResponse ConvertResponse(ObjectId friendId, List<UserEntity> users)
		{
			var user = users.FirstOrDefault(u => u.User_id == friendId);

			var friend = new FriendResponse
			{
				friendId = friendId.ToString(),				
				displayName = user.DisplayName
			};

			return friend;
		}
		
	}	
}