using System;
using System.Collections.Generic;
using Gloobster.Common;

namespace Gloobster.WebApiObjects
{
	public class VisitedPlacesRequest
	{
		public string UserId { get; set; }
		public VisitedPlaceRequest[] Places { get; set; }
	}

	public class VisitedPlaceRequest
	{
		public string CountryCode { get; set; }
		public string City { get; set; }
		public LatLng Location { get; set; }
		public string SourceId { get; set; }
		public int SourceType { get; set; }
		public List<DateTime> Dates { get; set; }

	}



}