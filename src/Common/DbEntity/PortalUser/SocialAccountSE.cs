using Gloobster.Common.CommonEnums;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using MongoDB.Bson.Serialization.Attributes;

namespace Gloobster.Common.DbEntity.PortalUser
{
	public class SocialAccountSE
	{		
		public SocialNetworkType NetworkType { get; set; }
		
		public SpecificsUserBase Specifics { get; set; }

		public SocAuthenticationSE Authentication { get; set; }
	}
}