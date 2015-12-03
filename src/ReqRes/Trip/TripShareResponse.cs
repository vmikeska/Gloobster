using System;
using System.Collections.Generic;
using Gloobster.Enums;

namespace Gloobster.ReqRes.Trip
{
	public class TripShareResponse
	{
		public string tripId { get; set; }

		public TripUsersResponse owner { get; set; }

		public string name { get; set; }
		
		public List<TripUsersResponse> participants { get; set; }
		
		public List<TripPlaceShareResponse> places { get; set; }
	}
	

	public class TripPlaceShareResponse
	{
		public string id { get; set; }
		public PlaceResponse place { get; set; }
		public int orderNo { get; set; }
		public DateTime? leavingDateTime { get; set; }
		public DateTime? arrivingDateTime { get; set; }

		public TravelType leavingType { get; set; }

	}
}