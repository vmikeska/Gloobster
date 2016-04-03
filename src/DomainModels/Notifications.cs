using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
				Status = NotificationStatus.Created,
                Created = DateTime.UtcNow
			};
		}

		public async Task<NotificationDO> FriendshipRequested(string requestorId, string receiverId)
		{
			var reqUserId = new ObjectId(requestorId);
			var requestingUser = DB.FOD<UserEntity>(u => u.User_id == reqUserId);
			
			return new NotificationDO
			{
				Title = $"{requestingUser.DisplayName} want to be your friend",
				Content = "If you know him/her, I guess you would like to confirm it",
                Link = "Friends/List",
                LinkText = "Go to Friends page",
				ContentType = ContentType.Text,
				UserId = receiverId,
				Status = NotificationStatus.Created,
                Created = DateTime.UtcNow
            };
		}

		public async Task<NotificationDO> TripInvitation(string fromUserId, string toUserId, string tripId)
		{
		    var fromUserIdObj = new ObjectId(fromUserId);            
            var fromUser = DB.FOD<UserEntity>(u => u.User_id == fromUserIdObj);
            

		    var tripIdObj = new ObjectId(tripId);
		    var trip = DB.FOD<TripEntity>(t => t.id == tripIdObj);

			var notif = new NotificationDO
			{
				Title = $"{fromUser.DisplayName} invited you to join a trip",
				UserId = toUserId,
				Status = NotificationStatus.Created,
                Link = $"Trip/Overview/{tripId}",
                LinkText = "See detail of the trip",

                Content = $"You are invited to be part of '{trip.Name}' trip from {fromUser.DisplayName}. {trip.Description}",
				ContentType = ContentType.Text,
                Created = DateTime.UtcNow
            };

			return notif;
		}

	}
}