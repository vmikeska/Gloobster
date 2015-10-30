using System;
using Gloobster.Common;
using Gloobster.Database;
using MongoDB.Bson;

namespace Gloobster.Entities
{
	public class VisitedCityEntity : EntityBase
	{
		public ObjectId PortalUser_id { get; set; }
		public LatLng Location { get; set; }
		public string CountryCode { get; set; }
		public string City { get; set; }
		public DateTime[] Dates { get; set; }
		public int GeoNamesId { get; set; }
	}	
}