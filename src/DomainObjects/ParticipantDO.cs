using Gloobster.Enums;

namespace Gloobster.DomainObjects
{
	public class ParticipantDO
	{
		public string UserId { get; set; }
		public bool IsAdmin { get; set; }
		public ParticipantState State { get; set; }
	}
}