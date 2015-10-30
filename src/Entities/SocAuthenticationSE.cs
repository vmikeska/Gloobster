using System;

namespace Gloobster.Entities
{
	public class SocAuthenticationSE
	{
		public string AccessToken { get; set; }
		public string TokenSecret { get; set; }
		public string UserId { get; set; }
		public DateTime ExpiresAt { get; set; }
	}
}