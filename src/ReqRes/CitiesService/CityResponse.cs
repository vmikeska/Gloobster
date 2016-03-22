using System.Collections.Generic;
using Gloobster.Common;

namespace Gloobster.ReqRes.CitiesService
{
	public class CityResponse
	{
		public int gid { get; set; }
		public string name { get; set; }
		public string asciiName { get; set; }
		public string alternateNames { get; set; }
		public LatLng coordinates { get; set; }
		public string countryCode { get; set; }
		public string alternateCountryCode { get; set; }
		public int population { get; set; }
		public string elevation { get; set; }
		public string timeZone { get; set; }
        public string usState { get; set; }
	}
}
