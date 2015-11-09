using System;
using System.Collections.Generic;
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

		public List<TripPlaceResponse>  places { get; set; }
		public List<TripTravelResponse> travels { get; set; }
		
	}

	public class TripPlaceResponse
	{
		public string id { get; set; }
		public int orderNo { get; set; }
		public string arrivingId { get; set; }
		public string leavingId { get; set; }
		public string sourceId { get; set; }
		public SourceType sourceType { get; set; }
		public string selectedName { get; set; }
	}

	public class TripTravelResponse
	{
		public string id { get; set; }
		public TravelType type { get; set; }
	}
}