using Gloobster.Enums;

namespace Gloobster.ReqRes.Friends
{
	public class FriendActionRequest
	{
		public string friendId { get; set; }
		public FriendActionType action { get; set; }
	}
}