using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Mappers;
using MongoDB.Bson;
using System.Linq;

namespace Gloobster.DomainModels
{
	public class ShareMapDomain : IShareMapDomain
	{
		public ISharedMapImageDomain ShareMapImage { get; set; }
		public IDbOperations DB { get; set; }
		public ITwitterShare TwitterShare { get; set; }
		public IFacebookShare FacebookShare { get; set; }
        public IAccountDomain AccountDomain { get; set; }

        public void ShareCities(ShareMapDO share)
		{			
			var fbAuth = AccountDomain.GetAuth(SocialNetworkType.Facebook, share.UserId);
            var twAuth = AccountDomain.GetAuth(SocialNetworkType.Twitter, share.UserId);
            
			bool userFbAuthenticated = fbAuth != null;
			bool shareToFb = share.Networks.Contains(SocialNetworkType.Facebook);
			if (shareToFb && userFbAuthenticated)
			{
				ShareToFB(share, fbAuth);
			}

			bool userTwAuthenticated = twAuth != null;
			bool shareToTwitter = share.Networks.Contains(SocialNetworkType.Twitter);
			if (shareToTwitter && userTwAuthenticated)
			{
				ShareToTwitter(share, twAuth);
			}
		}

		private void ShareToFB(ShareMapDO share, SocAuthDO fbAuth)
		{
			var opts = new FacebookShareOptionsDO
			{
				Message = share.Message,
				Picture = GetImageLink(share.UserId),

				Name = "This guy just shared his travel map",
				Description = "See the travel map of the guy",

				Caption = "Join Gloobster.com, web for travelers",

				Link = GetSharePageLink(share.UserId)
			};
            
			FacebookShare.Share(opts, fbAuth);
		}

		private void ShareToTwitter(ShareMapDO share, SocAuthDO twAuth)
		{
			var opts = new TwitterShareOptionsDO
			{
				Link = GetSharePageLink(share.UserId),
				ImagePath = GetLocalImageLink(share.UserId),
				Status = share.Message
			};

			
			TwitterShare.Tweet(opts, twAuth);
		}

		private string GetImageLink(string userId)
		{
			string link;

			if (GloobsterConfig.IsLocal)
			{
				link = ShareMapImage.GeneratePinBoardMapLink(userId);
			}
			else
			{
				link = GetLocalImageLink(userId);
			}

			return link;
		}

		private string GetLocalImageLink(string userId)
		{
			var protocol = "http";
			var link = $"{protocol}://{GloobsterConfig.Domain}/PinBoard/SharedMapImage/{userId}";
			return link;
		}

		private string GetSharePageLink(string userId)
		{
			var protocol = "http";
			var link = $"{protocol}://{GloobsterConfig.Domain}/PinBoard/Pins/{userId}";
			return link;
		}
	}
}