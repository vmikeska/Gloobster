using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gloobster.WebApiObjects
{
	public class PortalUserRequest
	{
		public string displayName { get; set; }
		public string password { get; set; }
		public string mail { get; set; }
		public FacebookUserAuthenticationRequest facebookUser { get; set; }
	}

	public class FacebookUserAuthenticationRequest
	{
		public string accessToken { get; set; }
		public string userID { get; set; }
		public int expiresIn { get; set; }
		public string signedRequest { get; set; }
	}


	
}
