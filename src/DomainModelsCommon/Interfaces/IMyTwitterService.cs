using System;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface IMyTwitterService
	{
		Uri BuildAuthorizationUri();
		TwitterUserAuthenticationDO VerifyCredintial(string oauthToken, string oauthVerifier);
	}
}