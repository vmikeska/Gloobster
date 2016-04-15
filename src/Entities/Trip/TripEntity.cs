using System;
using System.Collections.Generic;
using Gloobster.Database;
using MongoDB.Bson;

namespace Gloobster.Entities.Trip
{
	public class TripEntity : EntityBase
	{
		public ObjectId User_id { get; set; }

		public string Name { get; set; }

		public string Description { get; set; }
		public string Notes { get; set; }

        public bool FriendsPublic { get; set; }
		public bool NotesPublic { get; set; }
        public bool AllowToRequestJoin { get; set; }
        public string SharingCode { get; set; }

        public string LastSharingMessage { get; set; }

        public bool HasBigPicture { get; set; }
        public bool HasSmallPicture { get; set; }

        public DateTime CreatedDate { get; set; }

		public List<CommentSE> Comments { get; set; }

		public List<FileSE> Files { get; set; }
        public List<FilePublicSE> FilesPublic { get; set; }

		public List<ParticipantSE> Participants { get; set; } 

		public List<TripPlaceSE> Places { get; set; }
		public List<TripTravelSE> Travels { get; set; }
	}
}