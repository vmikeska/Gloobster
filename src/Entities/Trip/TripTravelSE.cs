using System;
using Gloobster.Enums;

namespace Gloobster.Entities.Trip
{
	public class TripTravelSE
	{
		public string Id { get; set; }
		public TravelType Type { get; set; }
		public string Description { get; set; }
		public FlightSE FlightFrom { get; set; }
		public FlightSE FlightTo { get; set; }
		public DateTime? LeavingDateTime { get; set; }
		public DateTime? ArrivingDateTime { get; set; }
	}
}