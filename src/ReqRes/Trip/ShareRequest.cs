using System.Collections.Generic;
using Gloobster.Enums;

namespace Gloobster.ReqRes.Trip
{
	public class ShareRequest
	{
		public string message { get; set; }
		public string tripId { get; set; }
		public List<SocialNetworkType> networks { get; set; }
	}
}