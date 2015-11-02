using System;
using System.Collections.Generic;

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
	}
}