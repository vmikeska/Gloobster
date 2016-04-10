using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.Entities.Trip
{
	public class FileSE
	{
        public ObjectId id { get; set; }
		public ObjectId User_id { get; set; }
		public string OriginalFileName { get; set; }
		public string SavedFileName { get; set; }
		public string Type { get; set; }
		public TripEntityType EntityType { get; set; }
		public string EntityId { get; set; }
	}

    public class FilePublicSE
    {
        public ObjectId File_id { get; set; }
        public bool IsPublic { get; set; }
    }
}