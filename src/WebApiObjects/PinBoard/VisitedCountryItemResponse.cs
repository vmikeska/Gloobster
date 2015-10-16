using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gloobster.WebApiObjects.PinBoard
{
	public class VisitedCountryItemResponse
	{
		public string PortalUserId { get; set; }
		public List<DateTime> Dates { get; set; }
		public string CountryCode2 { get; set; }		
		public string CountryCode3 { get; set; }
		public int ColorId { get; set; }
	}
}
