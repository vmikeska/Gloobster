using System.Collections.Generic;

namespace Gloobster.ReqRes.Friends
{
	public class FriendsResponse
	{
		public List<FriendResponse> Friends { get; set; }

		public List<FriendResponse> Proposed { get; set; }

		public List<FriendResponse> FacebookRecommended { get; set; }

		public List<FriendResponse> AwaitingConfirmation { get; set; }

		public List<FriendResponse> Blocked { get; set; }
	}
}