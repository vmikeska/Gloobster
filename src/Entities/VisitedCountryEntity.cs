using System;
using System.Collections.Generic;
using Gloobster.Database;
using MongoDB.Bson;

namespace Gloobster.Entities
{
	public class VisitedCountryEntity : EntityBase
	{
		public ObjectId PortalUser_id { get; set; }
		public string CountryCode2 { get; set; }
		public List<DateTime> Dates { get; set; }
	}
}