using System;
using Gloobster.Database;
using MongoDB.Bson;

namespace Gloobster.Entities
{
	public class TripEntity : EntityBase
	{
		public ObjectId PortalUser_id { get; set; }

		public string Name { get; set; }

		public DateTime CreatedDate { get; set; }
	}
}