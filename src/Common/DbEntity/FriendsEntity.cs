using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;

namespace Gloobster.Common.DbEntity
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
