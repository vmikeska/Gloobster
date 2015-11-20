using System.Collections.Generic;

namespace Gloobster.Entities.Trip
{
	public class TripPlaceSE
	{
		public string Id { get; set; }		
		public string Description { get; set; }
		public int OrderNo { get; set; }
		public string ArrivingId { get; set; }
		public string LeavingId { get; set; }
		public PlaceSE Place { get; set; }
		public PlaceSE Address { get; set; }
		public string AddressText { get; set; }
		public List<PlaceIdSE> WantVisit { get; set; }		
	}
}