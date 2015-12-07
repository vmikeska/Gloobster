using System.Collections.Generic;
using Gloobster.Enums;

namespace Gloobster.DomainObjects
{
	public class ShareTripDO
	{
		public string TripId { get; set; }
		public string Message { get; set; }
		public List<SocialNetworkType> Networks { get; set; }
		public bool AllowRequestJoin { get; set; }
		public string UserId { get; set; }
	}
}