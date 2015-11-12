using Gloobster.Enums;

namespace Gloobster.ReqRes.Files
{
	public class TripFileRequest
	{
		public string fileName { get; set; }
		public string data { get; set; }
		public FilePartType filePartType { get; set; }		
		public string type { get; set; }
		public string tripId { get; set; }
		public TripEntityType entityType { get; set; }
		public string entityId { get; set; }
	}
}