using System;
using Gloobster.Common;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Mappers;
using TweetSharp;

namespace Gloobster.DomainModels.Services.Twitter
{
	public class MyTwitterService: IMyTwitterService
	{
		public TwitterService TwitterSvc { get; set; }

		public MyTwitterService()
		{
			TwitterSvc = new TwitterService(GloobsterConfig.TwitterConsumerKey, GloobsterConfig.TwitterConsumerSecret);
		}

		private string GetCallbackUrl()
		{			
			return $"{GloobsterConfig.Protocol}://{GloobsterConfig.Domain}/TwitterUser/AuthCallback";		
		}

		public Uri BuildAuthorizationUri()
		{
			var url = GetCallbackUrl();

			// Step 1 - Retrieve an OAuth Request Token			
			// This is the registered callback URL
			OAuthRequestToken requestToken = TwitterSvc.GetRequestToken(url);

			// Step 2 - Redirect to the OAuth Authorization URL
			Uri uri = TwitterSvc.GetAuthorizationUri(requestToken);
			return uri;
		}

		public SocAuthenticationDO VerifyCredintial(string oauthToken, string oauthVerifier)
		{
			var requestToken = new OAuthRequestToken { Token = oauthToken };

			// Step 3 - Exchange the Request Token for an Access Token			
			OAuthAccessToken accessToken = TwitterSvc.GetAccessToken(requestToken, oauthVerifier);

			var auth = new SocAuthenticationDO
			{
				TokenSecret = accessToken.TokenSecret,
				AccessToken = accessToken.Token,
				UserId = accessToken.UserId.ToString()
			};

			return auth;
		}

		public ITwitterService GetAuthenticatedService(string accessToken, string accessTokenSecret)
		{
			TwitterSvc.AuthenticateWith(accessToken, accessTokenSecret);
			return TwitterSvc;
		}



	}
}