using System;
using Gloobster.DomainModelsCommon.DO;
using TweetSharp;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface IMyTwitterService
	{
		Uri BuildAuthorizationUri(string mail);
		SocAuthenticationDO VerifyCredintial(string oauthToken, string oauthVerifier);

		ITwitterService GetAuthenticatedService(string accessToken, string accessTokenSecret);
	}
}