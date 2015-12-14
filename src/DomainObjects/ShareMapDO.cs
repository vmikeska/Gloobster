using System.Collections.Generic;
using Gloobster.Enums;

namespace Gloobster.DomainObjects
{
	public class ShareMapDO
	{
		public string Message { get; set; }
		public List<SocialNetworkType> Networks { get; set; }
		public string UserId { get; set; }
	}
}