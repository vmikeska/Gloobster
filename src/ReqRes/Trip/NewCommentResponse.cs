using System.Collections.Generic;

namespace Gloobster.ReqRes.Trip
{
	public class NewCommentResponse
	{
		public List<CommentResponse> comments { get; set; } 
		public List<TripUsersResponse> users { get; set; }
	}
}