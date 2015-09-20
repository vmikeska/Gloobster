using System;

namespace Gloobster.DomainModels.Services.PlaceSearch
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

	public enum SourceType { FB, S4, GN }

	public class LatLng
	{
		public string Lat { get; set; }
		public string Lng { get; set; }
	}
}
