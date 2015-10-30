using System;
using Gloobster.Common;
using Gloobster.Database;
using MongoDB.Bson;

namespace Gloobster.Entities
{
	public class VisitedPlaceEntity: EntityBase
	{
		public ObjectId PortalUser_id { get; set; }
		public LatLng Location { get; set; }
		public string CountryCode { get; set; }
		public string City { get; set; }
		public DateTime[] Dates { get; set; }

		public string SourceId { get; set; }
		public int SourceType { get; set; }
	}

	
	
	
	
	
	
}