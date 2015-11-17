using Gloobster.Common;

namespace Gloobster.ReqRes.Airport
{
	public class AirportResponse
	{
		public string id { get; set; }
		public int origId { get; set; }
		public string name { get; set; }

		public string city { get; set; }

		public string countryCode { get; set; }

		public string iataFaa { get; set; }

		public string icao { get; set; }

		public LatLng coord { get; set; }

		public int alt { get; set; }
	}
}