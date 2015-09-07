using System;

namespace Gloobster.DomainModelsCommon.DO
{
	public class FacebookUserAuthenticationDO
	{
		public string AccessToken { get; set; }
		public string UserId { get; set; }
		public DateTime ExpiresAt { get; set; }
	}
}