using System;
using System.Collections.Generic;
using Gloobster.Database;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.Entities
{
	public class NotificationsEntity : EntityBase
	{
		public ObjectId PortalUser_id { get; set; }
		public List<NotificationSE> Notifications { get; set; }
	}

	public class NotificationSE
	{		
		public ObjectId id { get; set; }
		public string Title { get; set; }
		public string Content { get; set; }
        public string Link { get; set; }
        public string LinkText { get; set; }
        public ContentType ContentType { get; set; }
		public NotificationStatus Status { get; set; }
        public DateTime Created { get; set; }
	}
}