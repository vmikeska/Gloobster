using System.Collections.Generic;

namespace Gloobster.ReqRes.Trip
{
	public class ShareRequest
	{
		public string caption { get; set; }
		public string tripId { get; set; }
		public List<ParticipantRequest> users { get; set; }
	}
}