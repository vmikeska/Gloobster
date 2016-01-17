using System;
using System.Collections.Generic;
using Gloobster.Common;
using Gloobster.Database;
using MongoDB.Bson;

namespace Gloobster.Entities
{    
    public class VisitedEntity : EntityBase
	{
		public ObjectId PortalUser_id { get; set; }

		public List<VisitedCitySE> Cities { get; set; }
		public List<VisitedCountrySE> Countries { get; set; }
		public List<VisitedPlaceSE> Places { get; set; }
	}


	public class VisitedCitySE
	{		
		public ObjectId id { get; set; }
		public LatLng Location { get; set; }
		public string CountryCode { get; set; }
		public string City { get; set; }
		public DateTime[] Dates { get; set; }
		public int GeoNamesId { get; set; }
	}


	public class VisitedCountrySE
	{
		public ObjectId id { get; set; }
		public string CountryCode2 { get; set; }
		public List<DateTime> Dates { get; set; }
	}

	public class VisitedPlaceSE
	{
		public ObjectId id { get; set; }
		public LatLng Location { get; set; }
		public string CountryCode { get; set; }
		public string City { get; set; }
		public DateTime[] Dates { get; set; }

		public string SourceId { get; set; }
		public int SourceType { get; set; }
	}
}