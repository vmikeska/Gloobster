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

namespace Gloobster.DomainModels.Services.Facebook.FriendsExtractor
{
    public class FacebookFriendsService: IFacebookFriendsService
	{
		public IFacebookService FbService { get; set; }
		public IDbOperations DB { get; set; }
        public IAccountDomain AccountDomain { get; set; }

        public List<UserDO> GetFriends(string userId)
		{			
            var fbSocAuth = AccountDomain.GetAuth(SocialNetworkType.Facebook, userId);
                

            bool hasFacebook = fbSocAuth != null;
			if (!hasFacebook)
			{
				return null;
			}

			FbService.SetAccessToken(fbSocAuth.AccessToken);

			List<FacebookUser> fbFriends = GetFriends();
			List<string> friendsFBIds = fbFriends.Select(f => f.id).ToList();


            var friendsSocEntities =
                DB.List<SocialAccountEntity>(u => friendsFBIds.Contains(u.UserId) && u.NetworkType == SocialNetworkType.Facebook);
                

            var friendsSocUserIds = friendsSocEntities.Select(a => a.User_id).ToList();

            var friends = DB.List<UserEntity>(u => friendsSocUserIds.Contains(u.User_id));

            //var portalUsersQuery = 
            //    DB.C<SocialAccountEntity>().Where(u => u.SocialAccounts.Any(s => (s.NetworkType == SocialNetworkType.Facebook) && friendsFBIds.Contains(s.Authentication.UserId)));
            
			var portalUsersDo = friends.Select(u => u.ToDO()).ToList();
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