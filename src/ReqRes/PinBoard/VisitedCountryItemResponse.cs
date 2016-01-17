using System;
using System.Collections.Generic;

namespace Gloobster.ReqRes.PinBoard
{
	public class VisitedCountryItemResponse
	{
		public string PortalUserId { get; set; }
		public List<DateTime> Dates { get; set; }
		public string CountryCode2 { get; set; }				
		public int ColorId { get; set; }
        public int Count { get; set; }
    }
}
