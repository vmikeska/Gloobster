using System;
using System.Collections.Generic;
using Gloobster.Database;
using MongoDB.Bson;

namespace Gloobster.Entities
{
	public class TripEntity : EntityBase
	{
		public ObjectId PortalUser_id { get; set; }

		public string Name { get; set; }

		public DateTime CreatedDate { get; set; }

		public List<CommentSE> Comments { get; set; }
	}

	public class CommentSE
	{
		public ObjectId PortalUser_id { get; set; }
		public DateTime PostDate { get; set; }
		public string Text { get; set; }
	}
}