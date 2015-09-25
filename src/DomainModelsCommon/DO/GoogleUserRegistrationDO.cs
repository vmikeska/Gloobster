using System;

namespace Gloobster.DomainModelsCommon.DO
{
	public class GoogleUserRegistrationDO
	{
		public string UserId { get; set; }
		public string DisplayName { get; set; }		
		public string Mail { get; set; }
		public DateTime ExpiresAt { get; set; }
		public string AccessToken { get; set; }
		public string ProfileLink { get; set; }
	}
}