using System.Collections.Generic;
using Gloobster.Database;
using MongoDB.Bson;

namespace Gloobster.Entities
{
    public class FriendsEntity: EntityBase
    {
		public ObjectId PortalUser_id { get; set; }

	    public List<ObjectId> Friends { get; set; }

		public List<ObjectId> Proposed { get; set; }

		public List<ObjectId> AwaitingConfirmation { get; set; }

		public List<ObjectId> Blocked { get; set; }
	}
}
