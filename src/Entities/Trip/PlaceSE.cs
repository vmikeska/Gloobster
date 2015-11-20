using Gloobster.Common;
using Gloobster.Enums;

namespace Gloobster.Entities.Trip
{
	public class PlaceSE
	{
		public string SourceId { get; set; }
		public SourceType SourceType { get; set; }
		public string SelectedName { get; set; }		
		public LatLng Coordinates { get; set; }
	}
}