using System;
using System.Collections.Generic;
using Gloobster.Common;

namespace Gloobster.ReqRes.PinBoard
{
	public class VisitedCityItemResponse
	{
		public List<DateTime> Dates { get; set; }
		public string PortalUserId { get; set; }
		public string CountryCode { get; set; }
		public string City { get; set; }
		public LatLng Location { get; set; }
		public int GeoNamesId { get; set; }	
        public int Count { get; set; }	
	}
}