using System;
using MongoDB.Bson;

namespace Gloobster.Common.DbEntity
{
	public class TripEntity : EntityBase
	{
		public ObjectId PortalUser_id { get; set; }

		public string Name { get; set; }

		public DateTime CreatedDate { get; set; }
	}
}