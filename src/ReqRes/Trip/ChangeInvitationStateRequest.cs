using Gloobster.Enums;

namespace Gloobster.ReqRes.Trip
{
	public class ChangeInvitationStateRequest
	{
		public string tripId { get; set; }
		public ParticipantState newState { get; set; }
	}
}