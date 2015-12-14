using System.Collections.Generic;
using Gloobster.Enums;

namespace Gloobster.ReqRes.PinBoard
{
	public class MapShareRequest
	{
		public string message { get; set; }
		public List<SocialNetworkType> networks { get; set; }
	}
}