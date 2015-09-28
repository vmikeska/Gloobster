using System;

namespace Gloobster.Common.DbEntity.PortalUser
{
	public class SocAuthenticationSE
	{
		public string AccessToken { get; set; }
		public string TokenSecret { get; set; }
		public string UserId { get; set; }
		public DateTime ExpiresAt { get; set; }
	}
}