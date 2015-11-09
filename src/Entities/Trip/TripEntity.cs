using System;
using System.Collections.Generic;
using Gloobster.Database;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.Entities.Trip
{
	public class TripEntity : EntityBase
	{
		public ObjectId PortalUser_id { get; set; }

		public string Name { get; set; }

		public string Description { get; set; }
		public string Notes { get; set; }

		public bool NotesPublic { get; set; }

		public string Picture { get; set; }

		public DateTime CreatedDate { get; set; }

		public List<CommentSE> Comments { get; set; }

		public List<FileSE> Files { get; set; }

		public List<ParticipantSE> Participants { get; set; } 

		public List<TripPlaceSE> Places { get; set; }
		public List<TripTravelSE> Travels { get; set; }
	}

	public class TripPlaceSE
	{
		public string Id { get; set; }		
		public int OrderNo { get; set; }
		public string ArrivingId { get; set; }
		public string LeavingId { get; set; }
		public string SourceId { get; set; }
		public SourceType SourceType { get; set; }
		public string SelectedName { get; set; }
	}

	public class TripTravelSE
	{
		public string Id { get; set; }
		public TravelType Type { get; set; }
	}
}