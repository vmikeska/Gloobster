using System;
using System.Collections.Generic;
using MongoDB.Bson;

namespace Gloobster.DomainModelsCommon.DO
{
	public class VisitedCountryDO : IEquatable<VisitedCountryDO>
	{
		public string PortalUserId { get; set; }
		public List<DateTime> Dates { get; set; }

		public string CountryCode2 { get; set; }
		public bool Equals(VisitedCountryDO other)
		{
			return this.CountryCode2 == other.CountryCode2;
		}
	}
}