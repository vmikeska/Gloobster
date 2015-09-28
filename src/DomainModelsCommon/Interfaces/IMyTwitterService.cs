using System;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface IMyTwitterService
	{
		Uri BuildAuthorizationUri(string mail);
		SocAuthenticationDO VerifyCredintial(string oauthToken, string oauthVerifier);
	}
}