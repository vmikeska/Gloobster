using System;
using System.Collections.Generic;
using System.Linq;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Friends;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Friends
{
	public class FriendsSearchController : BaseApiController
	{
		public IFacebookFriendsService FbFriendsService { get; set; }
		public IFriendsDomain FriendsDoimain { get; set; }

		public FriendsSearchController(IFacebookFriendsService fbFriendsService, IFriendsDomain friendsDoimain,
            ILogger log, IDbOperations db) : base(log, db)
		{
			FbFriendsService = fbFriendsService;
			FriendsDoimain = friendsDoimain;
		}


		[HttpGet]
		[AuthorizeApi]
		public IActionResult Get(string name)
		{
			var friendsResponse = new List<FriendResponse>();

			if (string.IsNullOrEmpty(name))
			{
				return new ObjectResult(friendsResponse);
			}

			var friends = DB.C<FriendsEntity>().FirstOrDefault(f => f.PortalUser_id == UserIdObj);

			if (friends == null)
			{
				throw new Exception();
			}

			var users =
				DB.C<PortalUserEntity>()
					.Where(u => friends.Friends.Contains(u.id) && u.DisplayName.ToLower().Contains(name))
					.ToList();

			if (users.Any())
			{
				friendsResponse = users.Select(ToResponse).ToList();
			}
			
			return new ObjectResult(friendsResponse);
		}

		private FriendResponse ToResponse(PortalUserEntity portalUser)
		{			
			var friend = new FriendResponse
			{
				friendId = portalUser.id.ToString(),				
				displayName = portalUser.DisplayName
			};

			return friend;
		}

	}
}