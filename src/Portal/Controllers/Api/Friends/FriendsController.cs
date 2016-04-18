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
        

        public FriendsController(IFacebookFriendsService fbFriendsService, IFriendsDomain friendsDoimain, ILogger log, IDbOperations db) : base(log, db)
		{
			FbFriendsService = fbFriendsService;
			FriendsDoimain = friendsDoimain;        
		}

	    private void AddLog(string text)
	    {
	        Log.Debug($"FriendsController: {text}");
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
		    try
		    {
		        AddLog($"getting friends of {userId}");
		        var userIdObj = new ObjectId(userId);

		        var friendsEntity = DB.FOD<FriendsEntity>(f => f.User_id == userIdObj);
		        if (friendsEntity == null)
		        {
                    AddLog("friends entity not found");
                }

		        var allInvolvedUserIds = GetAllInvolvedUserIds(friendsEntity);

		        var friends = DB.List<UserEntity>(u => allInvolvedUserIds.Contains(u.User_id));
                AddLog($"friends count {friends.Count}");

                var fbFriendsFiltered = GetFbFriends(userId, friendsEntity);
                AddLog($"fbFriendsFiltered");

		        var response = new FriendsResponse();
		        
		        if (friendsEntity != null)
		        {
                    if (friendsEntity.Friends != null)
                    {                     
                        response.Friends = ConvertResponse(friendsEntity.Friends, friends);                        
                        AddLog($"Friends count: {response.Friends.Count}");
                    }

                    if (friendsEntity.AwaitingConfirmation != null)
                    {                        
                        response.AwaitingConfirmation = ConvertResponse(friendsEntity.AwaitingConfirmation, friends);
                        AddLog($"AwaitingConfirmation count: {response.AwaitingConfirmation.Count}");
                    }

                    if (friendsEntity.Blocked != null)
                    {                     
                        response.Blocked = ConvertResponse(friendsEntity.Blocked, friends);
                        AddLog($"Blocked count: {response.Blocked.Count}");
                    }

                    if (friendsEntity.Proposed != null)
                    {                     
                        response.Proposed = ConvertResponse(friendsEntity.Proposed, friends);
                        AddLog($"Proposed count: {response.Proposed.Count}");
                    }

                    if (fbFriendsFiltered != null)
                    {                        
                        response.FacebookRecommended =
                            fbFriendsFiltered.Select(f => new FriendResponse
                            {
                                friendId = f.UserId,
                                displayName = f.DisplayName
                            }).ToList();
                        AddLog($"FacebookRecommended count: {response.FacebookRecommended.Count}");
                    }                    
                }
                
		        return response;
		    }
		    catch (Exception exc)
		    {
                AddLog($"GetFriends: exception: {exc.Message}");
                throw;
		    }
        }

		private List<UserDO> GetFbFriends(string userId, FriendsEntity friends)
		{
			var result = new List<UserDO>();

		    try
		    {
                AddLog("GetFbFriends start");
                var fbFriends = FbFriendsService.GetFriends(userId);
		        if (fbFriends != null)
		        {
		            AddLog($"GetFbFriends count: {fbFriends.Count}");
		            result = fbFriends.Where(f =>
		            {
		                var userIdObj = new ObjectId(f.UserId);
		                return !friends.Friends.Contains(userIdObj) &&
		                       !friends.Proposed.Contains(userIdObj) &&
		                       !friends.AwaitingConfirmation.Contains(userIdObj);
		            }).ToList();
		        }
		        else
		        {
                    AddLog($"GetFbFriends count: null");
                } 
		    }
		    catch (Exception exc)
		    {
                AddLog("GetFbFriends: " + exc.Message);
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

		private List<FriendResponse> ConvertResponse(List<ObjectId> fids, List<UserEntity> users)
		{
		    var res = new List<FriendResponse>();
            
		    foreach (var userId in fids)
		    {
                var user = users.FirstOrDefault(u => u.User_id == userId);
		        if (user != null)
		        {
                    var friend = new FriendResponse
                    {
                        friendId = user.User_id.ToString(),
                        displayName = user.DisplayName
                    };
                    res.Add(friend);
                }
            }
            
			return res;
		}
		
	}	
}