using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
using Gloobster.Common.DbEntity.PortalUser;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.WebApiObjects;
using Gloobster.WebApiObjects.PinBoard;
using Microsoft.AspNet.Mvc;
using Gloobster.Mappers;
using MongoDB.Bson;

namespace Gloobster.Portal.Controllers
{

	[Route("api/[controller]")]
	public class BaseApiController: Controller
	{
		public IDbOperations DB { get; set; }

		public BaseApiController(IDbOperations db)
		{
			DB = db;
		}
		
	}

	
	public class FriendsActionsController : BaseApiController
	{
		public FriendsActionsController(IDbOperations db) : base(db)
		{
		}

		[HttpGet]
		[Authorize]
		public async Task<IActionResult> Get(string userId)
		{
			var userIdObj = new ObjectId(userId);

			var friendsEntity = DB.C<FriendsEntity>().FirstOrDefault(f => f.PortalUser_id == userIdObj);
			
			var friendsIds = new List<ObjectId>();
			friendsIds.AddRange(friendsEntity.AwaitingConfirmation);
			friendsIds.AddRange(friendsEntity.Blocked);
			friendsIds.AddRange(friendsEntity.Friends);
			friendsIds.AddRange(friendsEntity.Proposed);
			friendsIds = friendsIds.Distinct().ToList();

			var friends = DB.C<PortalUserEntity>().Where(u => friendsIds.Contains(u.id)).ToList();

			var response = new FriendsResponse
			{
				Friends = friendsEntity.Friends.Select(f => ConvertResponse(f, friends)).ToList(),
				AwaitingConfirmation = friendsEntity.AwaitingConfirmation.Select(f => ConvertResponse(f, friends)).ToList(),
				Blocked = friendsEntity.Blocked.Select(f => ConvertResponse(f, friends)).ToList(),
				Proposed = friendsEntity.Proposed.Select(f => ConvertResponse(f, friends)).ToList()
			};
			
			return new ObjectResult(response);
		}

		private FriendResponse ConvertResponse(ObjectId friendId, List<PortalUserEntity> portalUsers)
		{
			var portalUser = portalUsers.FirstOrDefault(u => u.id == friendId);

			var friend = new FriendResponse
			{
				FriendId = friendId.ToString(),
				PhotoUrl = portalUser.ProfileImage
			};

			return friend;
		}
		
	}

	public enum FriendshipState { Friends, Proposed, AwaitingConfirmation, Blocked }

	public class FriendsResponse
	{
		public List<FriendResponse> Friends { get; set; }

		public List<FriendResponse> Proposed { get; set; }

		public List<FriendResponse> AwaitingConfirmation { get; set; }

		public List<FriendResponse> Blocked { get; set; }
	}

	public class FriendResponse
	{
		public string FriendId { get; set; }
		public string PhotoUrl { get; set; }
		//public FriendshipState State { get; set; }
		
	}
}