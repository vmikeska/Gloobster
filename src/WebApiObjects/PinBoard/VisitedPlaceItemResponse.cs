using System;
using System.Collections.Generic;
using Gloobster.Common;

namespace Gloobster.WebApiObjects.PinBoard
{
	public class VisitedPlaceItemResponse
	{
		public List<DateTime> Dates { get; set; }
		public string PortalUserId { get; set; }		
		public LatLng Location { get; set; }
	}
}