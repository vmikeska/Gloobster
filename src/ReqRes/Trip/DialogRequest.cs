using Gloobster.Enums;

namespace Gloobster.ReqRes.Trip
{
	public class DialogRequest
	{
		public TripEntityType dialogType { get; set; }
		public string tripId { get; set; }
		public string id { get; set; }
	}
}