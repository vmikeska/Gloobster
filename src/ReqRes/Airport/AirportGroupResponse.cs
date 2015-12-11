using Gloobster.Common;

namespace Gloobster.ReqRes.Airport
{
	public class AirportGroupResponse
	{
		public string city { get; set; }
		public string countryCode { get; set; }
		public int gid { get; set; }
		public LatLng coord { get; set; }
		public int population { get; set; }
		public bool selected { get; set; }
	}
}