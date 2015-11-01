using System;

namespace Gloobster.ReqRes.Trip
{
	public class CommentResponse
	{
		public string userId { get; set; }
		public DateTime postDate { get; set; }
		public string text { get; set; }
	}
}