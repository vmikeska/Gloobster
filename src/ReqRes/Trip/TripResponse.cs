using System;
using System.Collections.Generic;
using Gloobster.Common;
using Gloobster.Enums;

namespace Gloobster.ReqRes.Trip
{
	public class TripResponse
	{
		public string tripId { get; set; }

		public string ownerId { get; set; }

		public string name { get; set; }

		public DateTime createdDate { get; set; }
		
		public List<TripUsersResponse> users { get; set; } 

		public List<CommentResponse> comments { get; set; }

		public List<FileResponse> files { get; set; }
        public List<FilePublicResponse> filesPublic { get; set; }

        public List<TripPlaceResponse>  places { get; set; }
		public List<TripTravelResponse> travels { get; set; }

		public List<ParticipantResponse> participants { get; set; }
	}

	public class ParticipantResponse
	{
		public string userId { get; set; }
		public bool isAdmin { get; set; }
		public ParticipantState state { get; set; }
	}

	public class TripPlaceResponse
	{
		public string id { get; set; }
		public string description { get; set; }
		public int orderNo { get; set; }
		public string arrivingId { get; set; }
		public string leavingId { get; set; }		
		public PlaceResponse place { get; set; }	
		public PlaceResponse address { get; set; }
		public string addressText { get; set; }
		public List<PlaceIdResponse> wantVisit { get; set; }
		public List<FileResponse> files { get; set; }
        public List<FilePublicResponse> filesPublic { get; set; }
    }

	public class PlaceResponse
	{
		public string sourceId { get; set; }
		public SourceType sourceType { get; set; }
		public string selectedName { get; set; }
		public LatLng coordinates { get; set; }
	}

	public class PlaceIdResponse
	{
		public string id { get; set; }
		public string sourceId { get; set; }
		public SourceType sourceType { get; set; }
		public string selectedName { get; set; }
	}

	public class TripTravelResponse
	{
		public string id { get; set; }
		public TravelType type { get; set; }
		public string description { get; set; }
		public List<FileResponse> files { get; set; }
        public List<FilePublicResponse> filesPublic { get; set; }
        public FlightResponse flightFrom { get; set; }
		public FlightResponse flightTo { get; set; }
		public DateTime? leavingDateTime { get; set; }
		public DateTime? arrivingDateTime { get; set; }
	}
}