using System.Collections.Generic;

namespace Gloobster.Portal.Controllers
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