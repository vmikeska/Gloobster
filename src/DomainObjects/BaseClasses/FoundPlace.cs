using System;

namespace Gloobster.DomainObjects.BaseClasses
{
	public class FoundPlace : IEquatable<FoundPlace>
	{
		public string CheckinId { get; set; }

		public DateTime Time { get; set; }

		public string City { get; set; }
		public string Country { get; set; }
		public string CountryCode2 { get; set; }
		public string CountryCode3 { get; set; }

		public float Latitude { get; set; }
		public float Longitude { get; set; }

		public bool Equals(FoundPlace other)
		{
			return this.Country == other.Country && this.City == other.City;
		}
	}
}