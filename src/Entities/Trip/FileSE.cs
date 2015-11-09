using MongoDB.Bson;

namespace Gloobster.Entities.Trip
{
	public class FileSE
	{
		public ObjectId PortalUser_id { get; set; }
		public string OriginalFileName { get; set; }
		public string SavedFileName { get; set; }
		public string Type { get; set; }

		//day or travel specific id
	}
}