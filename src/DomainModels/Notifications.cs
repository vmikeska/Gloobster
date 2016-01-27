using System.Collections.Generic;
using System.Linq;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.DomainModels
{
	public class Notifications : INotifications
	{
		public IDbOperations DB { get; set; }

		public NotificationDO NewAccountNotification(string userId)
		{
			return new NotificationDO
			{
				Title = "Welcome on our portal",
				Content = "Hope you will have fun with our travel components",
				ContentType = ContentType.Text,
				UserId = userId,
				Status = NotificationStatus.Created				
			};
		}

		public NotificationDO FriendshipRequested(string requestorId, string receiverId)
		{
			var reqUserId = new ObjectId(requestorId);
			var requestingUser = DB.C<PortalUserEntity>().FirstOrDefault(u => u.id == reqUserId);
			
			return new NotificationDO
			{
				Title = $"{requestingUser.DisplayName} want to be your friend",
				Content = "If you know him/her, I guess you would like to confirm it",
                Link = "Friends/List",
                LinkText = "Go to Friends page",
				ContentType = ContentType.Text,
				UserId = receiverId,
				Status = NotificationStatus.Created
			};
		}

		public NotificationDO TripInvitation(string fromUserId, string toUserId, string tripId)
		{
			var fromUser = DB.C<PortalUserEntity>().FirstOrDefault(u => u.id == new ObjectId(fromUserId));

		    var tripIdObj = new ObjectId(tripId);
		    var trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);

			var notif = new NotificationDO
			{
				Title = $"{fromUser.DisplayName} invited you to join a trip",
				UserId = toUserId,
				Status = NotificationStatus.Created,
                Link = $"Trip/Overview/{tripId}",
                LinkText = "See detail of the trip",

                Content = $"You are invited to be part of '{trip.Name}' trip from {fromUser.DisplayName}. {trip.Description}",
				ContentType = ContentType.Text
			};

			return notif;
		}

	}
}