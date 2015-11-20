using Gloobster.Enums;

namespace Gloobster.Entities.Trip
{
	public class PlaceIdSE
	{
		public string id { get; set; }
		public string SourceId { get; set; }
		public SourceType SourceType { get; set; }
		public string SelectedName { get; set; }
	}
}