using MongoDB.Bson;

namespace Gloobster.ReqRes.Trip
{
	public class FileResponse
	{
        public string id { get; set; }
		public string ownerId { get; set; }
		public string originalFileName { get; set; }
		public string savedFileName { get; set; }
		public string entityId { get; set; }
	}

    public class FilePublicResponse
    {
        public string fileId { get; set; }
        public bool isPublic { get; set; }
    }
}