using System;
using System.Collections.Generic;
using Gloobster.Common;

namespace Gloobster.DomainObjects
{
	public class VisitedPlaceDO : IEquatable<VisitedPlaceDO>
	{
		public List<DateTime> Dates { get; set; }
		public string PortalUserId { get; set; }
		public string CountryCode { get; set; }
		public string City { get; set; }
		public LatLng Location { get; set; }
		public string SourceId { get; set; }
		public SourceTypeDO SourceType { get; set; }

		public bool Equals(VisitedPlaceDO other)
		{
			return this.SourceType == other.SourceType && this.SourceId == SourceId;				
		}
	}
}