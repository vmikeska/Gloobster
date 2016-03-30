﻿using System;
using Gloobster.DomainObjects;
using TweetSharp;

namespace Gloobster.DomainInterfaces
{
	public interface IMyTwitterService
	{
		Uri BuildAuthorizationUri();
		SocAuthenticationDO VerifyCredintial(string oauthToken, string oauthVerifier);

		ITwitterService GetAuthenticatedService(string accessToken, string accessTokenSecret);
	}
}