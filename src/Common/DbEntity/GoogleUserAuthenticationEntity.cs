using System;

namespace Gloobster.Common.DbEntity
{
	public class GoogleUserAuthenticationEntity
	{
		public string UserId { get; set; }
		public DateTime ExpiresAt { get; set; }
		public string AccessToken { get; set; }
	}
}