using Gloobster.Enums;

namespace Gloobster.Entities
{
	public class SocialAccountSE
	{		
		public SocialNetworkType NetworkType { get; set; }
		
		public SpecificsUserBase Specifics { get; set; }

		public SocAuthenticationSE Authentication { get; set; }
	}
}