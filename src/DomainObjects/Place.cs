using Gloobster.Common;
using Gloobster.Enums;

namespace Gloobster.DomainObjects
{
	public class Place
	{
		public string Name { get; set; }
		public string City { get; set; }
		public string CountryCode { get; set; }
		public LatLng Coordinates { get; set; }
		public string SourceId { get; set; }
		public SourceType SourceType { get; set; }
	}
}
