using System.Linq;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Friends;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Friends
{
	public class UsersSearchController : BaseApiController
	{		
		public IFriendsDomain FriendsDoimain { get; set; }

		public UsersSearchController(IFriendsDomain friendsDoimain, ILogger log, IDbOperations db) : base(log, db)
		{			
			FriendsDoimain = friendsDoimain;
		}

		[HttpGet]
		[AuthorizeApi]
		public IActionResult Get(string searchQuery)
		{
		    var q = searchQuery.ToLower();
            
		    var friendsRes = DB.C<UserEntity>()
                .Where(u => u.DisplayName.ToLower().StartsWith(q))
                .Select(u => new 
		            {
		                DisplayName = u.DisplayName,
		                Id = u.id		                
		            })
                .ToList();

		    var friends = friendsRes.Select(f => new FriendResponse
		        {
		            friendId = f.Id.ToString(),		            
		            displayName = f.DisplayName
		        });

            var friendsEntity = DB.C<FriendsEntity>().FirstOrDefault(f => f.User_id == UserIdObj);

            //remove user itself            
            friends = friends.Where(u => u.friendId != UserId).ToList();
            
            //remove already firends		    
		    var friendsIds = friendsEntity.Friends.Select(f => f.ToString());            
            friends = friends.Where(f => !friendsIds.Contains(f.friendId)).ToList();
            //remove requested friends            
            var propoesdIds = friendsEntity.Proposed.Select(f => f.ToString());
            friends = friends.Where(f => !propoesdIds.Contains(f.friendId)).ToList();

            return new ObjectResult(friends);
		}
		
	}

}