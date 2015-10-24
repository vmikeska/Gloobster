using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
using Gloobster.Common.DbEntity.PortalUser;
using Gloobster.DomainModels.Services.Facebook.FriendsExtractor;
using Gloobster.DomainModelsCommon.Interfaces;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;

namespace Gloobster.Portal.Controllers.Api.Friends
{
	public class UsersSearchController : BaseApiController
	{		
		public IFriendsDomain FriendsDoimain { get; set; }

		public UsersSearchController(IFriendsDomain friendsDoimain, IDbOperations db) : base(db)
		{			
			FriendsDoimain = friendsDoimain;
		}

		[HttpGet]
		[Authorize]
		public IActionResult Get(string userId, string searchQuery)
		{
			var userIdObj = new ObjectId(userId);

			//todo: remove already friends ?
			//var friendsEntity = DB.C<FriendsEntity>().FirstOrDefault(f => f.PortalUser_id == userIdObj);

			//todo: fix to server query
			//var allFriends = DB.C<PortalUserEntity>().ToList();
			var friends = DB.C<PortalUserEntity>().Where(u => u.DisplayName.ToLower().Contains(searchQuery)).ToList();
			
			var friendsResponse = friends.Select(ConvertResponse).ToList();
			return new ObjectResult(friendsResponse);
		}
		
		private FriendResponse ConvertResponse(PortalUserEntity user)
		{			
			var friend = new FriendResponse
			{
				FriendId = user.id.ToString(),
				PhotoUrl = user.ProfileImage,
				DisplayName = user.DisplayName
			};

			return friend;
		}
		
	}
	

}