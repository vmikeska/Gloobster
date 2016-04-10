using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.Entities.Trip
{
	public class ParticipantSE
	{
		public ObjectId User_id { get; set; }
		public bool IsAdmin { get; set; }
		public ParticipantState State { get; set; }
	}
}