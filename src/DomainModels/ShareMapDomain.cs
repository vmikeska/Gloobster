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

		public void ShareCities(ShareMapDO share)
		{
			var userIdObj = new ObjectId(share.UserId);
			var sharingUser = DB.C<PortalUserEntity>().FirstOrDefault(u => u.id == userIdObj);
			SocialAccountSE fbAuth = sharingUser.SocialAccounts.FirstOrDefault(s => s.NetworkType == SocialNetworkType.Facebook);
			SocialAccountSE twAuth = sharingUser.SocialAccounts.FirstOrDefault(s => s.NetworkType == SocialNetworkType.Twitter);

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

		private void ShareToFB(ShareMapDO share, SocialAccountSE fbAuth)
		{
			var opts = new FacebookShareOptionsDO
			{
				Message = share.Message,
				Picture = GetImageLink(share.UserId),

				Name = "This guy just shared his travel map",
				Description = "See the travel map of the guy",

				Caption = "Join Gloobster.com, web for travelers",

				Link = GetSharePageLink(share.UserId),

				Privacy = new FacebookPrivacyDO
				{
					Description = "This is debug, only I can see it",
					Value = FacebookPrivacyLevel.SELF
				}
			};

			var fbAuthDO = fbAuth.Authentication.ToDO();

			FacebookShare.Share(opts, fbAuthDO);
		}

		private void ShareToTwitter(ShareMapDO share, SocialAccountSE twAuth)
		{
			var opts = new TwitterShareOptionsDO
			{
				Link = GetSharePageLink(share.UserId),
				ImagePath = GetLocalImageLink(share.UserId),
				Status = share.Message
			};

			var authDO = twAuth.Authentication.ToDO();
			TwitterShare.Tweet(opts, authDO);
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