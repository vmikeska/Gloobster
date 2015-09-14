using System;
using TweetSharp;

namespace Gloobster.DomainModels.Services.Twitter
{
	public interface IMyTwitterService
	{
		Uri BuildAuthorizationUri();
		TwitterUser VerifyCredintial(string oauthToken, string oauthVerifier);
	}
}