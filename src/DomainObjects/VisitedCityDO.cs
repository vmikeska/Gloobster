using System;
using System.Collections.Generic;
using Gloobster.Common;

namespace Gloobster.DomainObjects
{
	public class VisitedCityDO : IEquatable<VisitedCityDO>
	{
		public List<DateTime> Dates { get; set; }
        public int Count { get; set; }
        public string PortalUserId { get; set; }
		public string CountryCode { get; set; }
		public string City { get; set; }
		public LatLng Location { get; set; }
		public int GeoNamesId { get; set; }

		public bool Equals(VisitedCityDO other)
		{
			return this.CountryCode == other.CountryCode && this.City == other.City;
		}
	}
}