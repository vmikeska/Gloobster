using System;
using TweetSharp;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface IMyTwitterService
	{
		Uri BuildAuthorizationUri();
		TwitterUser VerifyCredintial(string oauthToken, string oauthVerifier);
	}
}