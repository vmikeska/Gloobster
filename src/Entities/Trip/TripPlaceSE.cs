using System.Collections.Generic;
using MongoDB.Bson;

namespace Gloobster.Entities.Trip
{
	public class TripPlaceSE
	{
        public ObjectId id { get; set; }
        public string Description { get; set; }
		public int OrderNo { get; set; }
		public ObjectId ArrivingId { get; set; }
		public ObjectId LeavingId { get; set; }
		public PlaceSE Place { get; set; }
        public bool UseTime { get; set; }
        public PlaceSE Address { get; set; }
		public string AddressText { get; set; }
		public List<PlaceIdSE> WantVisit { get; set; }		
	}
}