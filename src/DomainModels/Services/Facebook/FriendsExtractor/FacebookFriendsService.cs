using System.Collections.Generic;
using System.Linq;
using Gloobster.SocialLogin.Facebook.Communication;

namespace Gloobster.DomainModels.Services.Facebook.FriendsExtractor
{
	public class FacebookFriendsService
	{
		public IFacebookService FbService;

		public FacebookFriendsService(IFacebookService fbService)
		{
			FbService = fbService;
		}

		public List<FacebookUser> GetFriendsByFbUserId()
		{
			var fbQuery = "/me/friends";
			var friendsResponse = FbService.Get<FacebookFriendsResponse>(fbQuery);

			//todo: extract recurively

			return friendsResponse.data.ToList();
		}
	}
}