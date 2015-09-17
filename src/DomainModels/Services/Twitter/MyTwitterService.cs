using System;
using Gloobster.Common;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.Mappers;
using TweetSharp;

namespace Gloobster.DomainModels.Services.Twitter
{
	public class MyTwitterService: IMyTwitterService
	{
		public string CallbackUrl = "http://localhost:4441/TwitterUser/AuthCallback";

		public TwitterService TwitterSvc { get; set; }

		public MyTwitterService()
		{
			TwitterSvc = new TwitterService(GloobsterConfig.TwitterConsumerKey, GloobsterConfig.TwitterConsumerSecret);
		}

		public Uri BuildAuthorizationUri()
		{
			// Step 1 - Retrieve an OAuth Request Token			
			// This is the registered callback URL
			OAuthRequestToken requestToken = TwitterSvc.GetRequestToken(CallbackUrl);

			// Step 2 - Redirect to the OAuth Authorization URL
			Uri uri = TwitterSvc.GetAuthorizationUri(requestToken);
			return uri;
		}

		public TwitterUserAuthenticationDO VerifyCredintial(string oauthToken, string oauthVerifier)
		{
			var requestToken = new OAuthRequestToken { Token = oauthToken };

			// Step 3 - Exchange the Request Token for an Access Token			
			OAuthAccessToken accessToken = TwitterSvc.GetAccessToken(requestToken, oauthVerifier);

			var auth = new TwitterUserAuthenticationDO
			{
				TokenSecret = accessToken.TokenSecret,
				Token = accessToken.Token,
				TwUserId = accessToken.UserId
			};

			return auth;
		}


	}
}