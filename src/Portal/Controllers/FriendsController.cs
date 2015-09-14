using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.DomainModels.Services.Facebook.FriendsExtractor;
using Gloobster.SocialLogin.Facebook.Communication;
using Microsoft.AspNet.Mvc;
using Gloobster.Common.DbEntity;

//http://stackoverflow.com/questions/23417356/facebook-graph-api-v2-0-me-friends-returns-empty-or-only-friends-who-also-u

//https://www.sammyk.me/optimizing-request-queries-to-the-facebook-graph-api

//place query
//https://graph.facebook.com/search?q=coffee&type=place&center=37.76,122.427&distance=1000


namespace Gloobster.Portal.Controllers
{
    public class FriendsController: PortalBaseController
    {
	    public async Task<IActionResult> Friends()
	    {
		    var dbUserId = "55eda79e4a491b209ce2afcd";


		    var query = $"{{ '_id': ObjectId(\"{dbUserId}\") }}";
		    var results = await DB.FindAsync<PortalUserEntity>(query);
		    var portalUser = results.First();

		    var fbService = new FacebookService();

		    fbService.SetAccessToken(portalUser.Facebook.Authentication.AccessToken);
		    var fbFriendsService = new FacebookFriendsService(fbService);

		    var friends = fbFriendsService.GetFriendsByFbUserId();

		    friends = new List<FacebookUser> {new FacebookUser {id = "1031646796870176", name = "Bina Sabrina"}};

		    var viewModel = new FriendsViewModel
		    {
			    AppFriends = friends
		    };

			return View(viewModel);
		}

		public FriendsController(IDbOperations db) : base(db)
		{
		}

	}

	public class FriendsViewModel
	{
		public List<FacebookUser> AppFriends { get; set; }
	}


}
