using System;

namespace Gloobster.DomainModels.Services.Facebook.TaggedPlacesExtractor
{
	public class FoundPlace : IEquatable<FoundPlace>
	{
		public string CheckinId { get; set; }

		public DateTime Time { get; set; }

		public string City { get; set; }
		public string Country { get; set; }
		public string CountryCode2 { get; set; }
		public string CountryCode3 { get; set; }

		public double Latitude { get; set; }
		public double Longitude { get; set; }

		public bool Equals(FoundPlace other)
		{
			return this.Country == other.Country && this.City == other.City;
		}
	}
}