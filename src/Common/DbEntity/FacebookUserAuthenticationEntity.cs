using System;

namespace Gloobster.Common.DbEntity
{
	public class FacebookUserAuthenticationEntity
	{
		public string AccessToken { get; set; }
		public string UserId { get; set; }		
		public DateTime ExpiresAt { get; set; }		
	}
}