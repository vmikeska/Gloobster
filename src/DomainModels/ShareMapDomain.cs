using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Mappers;
using MongoDB.Bson;
using System.Linq;
using Serilog;
using System;

namespace Gloobster.DomainModels
{
	public class ShareMapDomain : IShareMapDomain
	{
        public ILogger Log { get; set; }

		public ISharedMapImageDomain ShareMapImage { get; set; }
		public IDbOperations DB { get; set; }
		public ITwitterShare TwitterShare { get; set; }
		public IFacebookShare FacebookShare { get; set; }
        public IAccountDomain AccountDomain { get; set; }
        public ILanguages Langs { get; set; }

        public string GetWord(string key, string lang)
        {
            string word = Langs.GetWord("sharing", key, lang);
            return word;
        }

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
		    try
		    {
		        var userIdObj = new ObjectId(share.UserId);
		        var user = DB.FOD<UserEntity>(u => u.User_id == userIdObj);

		        var opts = new FacebookShareOptionsDO
		        {
		            Message = share.Message,
		            Picture = GetImageLink(share.UserId),

		            Name = string.Format(GetWord("FbShare1", user.DefaultLang), user.DisplayName),
		            Description = GetWord("FbShare2", user.DefaultLang),

		            Caption = GetWord("FbShare3", user.DefaultLang),

		            Link = GetSharePageLink(share.UserId)
		        };

		        FacebookShare.Share(opts, fbAuth);
		    }
		    catch (Exception exc)
		    {
		        Log.Error($"ShareToFB: {exc.Message}");
		    }
		}

		private void ShareToTwitter(ShareMapDO share, SocAuthDO twAuth)
		{
		    try
		    {
		        var opts = new TwitterShareOptionsDO
		        {
		            Link = GetSharePageLink(share.UserId),
		            ImagePath = GetLocalImageLink(share.UserId),
		            Status = share.Message
		        };

		        TwitterShare.Tweet(opts, twAuth);
		    }
		    catch (Exception exc)
		    {
		        Log.Error($"ShareToTwitter: {exc.Message}");
		    }
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
			var link = $"{GloobsterConfig.Protocol}://{GloobsterConfig.Domain}/PinBoard/SharedMapImage/{userId}";
			return link;
		}

		private string GetSharePageLink(string userId)
		{
            var link = $"{GloobsterConfig.Protocol}://{GloobsterConfig.Domain}/tm";            
            return link;
		}
	}
}