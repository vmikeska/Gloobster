using System;

namespace Gloobster.DomainModelsCommon.DO
{
	public class VisitedPlaceDO : IEquatable<VisitedPlaceDO>
	{
		public string PortalUserId { get; set; }
		public string CountryCode { get; set; }
		public string City { get; set; }
		public double PlaceLatitude { get; set; }
		public double PlaceLongitude { get; set; }
		public string SourceId { get; set; }
		public SourceTypeDO SourceType { get; set; }

		public bool Equals(VisitedPlaceDO other)
		{
			return this.CountryCode == other.CountryCode && this.City == other.City;
		}
	}

	public enum SourceTypeDO { None, Facebook, GeoNames, Twitter }
}