﻿namespace Gloobster.WebApiObjects
{
	public class VisitedPlaceResponse
	{
		public string UserId { get; set; }
		public VisitedPlaceItem[] Places { get; set; }
	}

	public class VisitedPlaceItem
	{
		public string CountryCode { get; set; }
		public string City { get; set; }
		public double PlaceLatitude { get; set; }
		public double PlaceLongitude { get; set; }
		public string SourceId { get; set; }
		public string SourceType { get; set; }
	}



}