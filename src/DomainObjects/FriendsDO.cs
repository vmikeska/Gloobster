using System.Collections.Generic;

namespace Gloobster.DomainObjects
{
	public class FriendsDO
	{
		public string id { get; set; }
		public string UserId { get; set; }

		public List<string> Friends { get; set; }

		public List<string> Proposed { get; set; }

		public List<string> AwaitingConfirmation { get; set; }

		public List<string> Blocked { get; set; }
	}
}