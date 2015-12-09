using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Mappers;
using MongoDB.Bson;

namespace Gloobster.DomainModels
{
	public class NotificationsDomain: INotificationsDomain
	{
		public IDbOperations DB { get; set; }

	    public async void AddNotification(NotificationDO notification)
	    {
		    var userIdObj = new ObjectId(notification.UserId);
		    var notifications = DB.C<NotificationsEntity>().FirstOrDefault(e => e.PortalUser_id == userIdObj);
		    if (notifications == null)
		    {
			    CretateNotificationEntity(userIdObj);
		    }

		    var notificationSE = notification.ToEntity();
		    notificationSE.id = ObjectId.GenerateNewId();

		    await PushNotification(notification.UserId, notificationSE);
	    }

		private async Task<bool> PushNotification(string userId, NotificationSE notification)
		{
			var userIdObj = new ObjectId(userId);			
			var filter = DB.F<NotificationsEntity>().Eq(p => p.PortalUser_id, userIdObj);				
			var update = DB.U<NotificationsEntity>().Push(n => n.Notifications, notification);
			var res = await DB.UpdateAsync(filter, update);
			return res.ModifiedCount == 1;
		}

		private async void CretateNotificationEntity(ObjectId userId)
		{
			var e = new NotificationsEntity
			{
				Notifications = new List<NotificationSE>(),
				PortalUser_id = userId
			};
			await DB.SaveAsync(e);
		}
    }

	public class Notifications
	{
		public NotificationDO NewAccountNotification(string userId)
		{
			return new NotificationDO
			{
				Title = "You are now registered",
				Content = "Welcome on our portal",
				ContentType = ContentType.Text,
				UserId = userId,
				Status = NotificationStatus.Created				
			};
		}
		
	}

	
	
	
}
