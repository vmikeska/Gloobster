using System;
using System.Collections.Generic;
using Gloobster.Common;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.Entities.Trip
{
	public class TripTravelSE
	{
		public ObjectId id { get; set; }
		public TravelType Type { get; set; }
		public string Description { get; set; }
		public FlightSE FlightFrom { get; set; }
		public FlightSE FlightTo { get; set; }
        public bool UseTime { get; set; }
        public DateTime? LeavingDateTime { get; set; }
		public DateTime? ArrivingDateTime { get; set; }
        public List<LatLng> WayPoints { get; set; }
	}
}