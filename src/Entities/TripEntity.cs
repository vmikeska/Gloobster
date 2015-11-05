using System;
using System.Collections.Generic;
using Gloobster.Database;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.Entities
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
	}

	public class ParticipantSE
	{
		public ObjectId PortalUser_id { get; set; }
		public bool IsAdmin { get; set; }
		public ParticipantState State { get; set; }
	}

	public class CommentSE
	{
		public ObjectId PortalUser_id { get; set; }
		public DateTime PostDate { get; set; }
		public string Text { get; set; }
	}

	public class FileSE
	{
		public ObjectId PortalUser_id { get; set; }
		public string OriginalFileName { get; set; }
		public string SavedFileName { get; set; }
		public string Type { get; set; }

		//day or travel specific id
	}
}