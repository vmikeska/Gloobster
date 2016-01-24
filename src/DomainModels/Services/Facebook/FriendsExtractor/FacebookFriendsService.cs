using System.Collections.Generic;
using System.Linq;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.SocialLogin.Facebook.Communication;
using MongoDB.Bson;

namespace Gloobster.DomainModels.Services.Facebook.FriendsExtractor
{
	public class FacebookFriendsService: IFacebookFriendsService
	{
		public IFacebookService FbService { get; set; }
		public IDbOperations DB { get; set; }
		
		public List<PortalUserDO> GetFriends(string userId)
		{
			var userIdObj = new ObjectId(userId);

			var portalUser = DB.C<PortalUserEntity>().FirstOrDefault(u => u.id == userIdObj);

		    if (portalUser.SocialAccounts == null)
		    {
		        return null;
		    }

            var fbSocAuth = portalUser.SocialAccounts.FirstOrDefault(s => s.NetworkType == SocialNetworkType.Facebook);
			
			bool hasFacebook = fbSocAuth != null;
			if (!hasFacebook)
			{
				return null;
			}

			FbService.SetAccessToken(fbSocAuth.Authentication.AccessToken);

			List<FacebookUser> fbFriends = GetFriends();
			List<string> friendsFBIds = fbFriends.Select(f => f.id).ToList();

			var portalUsersQuery = DB.C<PortalUserEntity>().Where(u =>
							u.SocialAccounts.Any(s => (s.NetworkType == SocialNetworkType.Facebook) && friendsFBIds.Contains(s.Authentication.UserId)));
			var portalUsers = portalUsersQuery.ToList();
			
			var portalUsersDo = portalUsers.Select(u => u.ToDO()).ToList();
			return portalUsersDo;
		}

		private List<FacebookUser> GetFriends()
		{
			var fbQuery = "/me/friends";
			var friendsResponse = FbService.Get<FacebookFriendsResponse>(fbQuery);

			//todo: extract recurively

			return friendsResponse.data.ToList();
		}
	}
}