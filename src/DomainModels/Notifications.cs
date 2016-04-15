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
        public ILanguages Langs { get; set; }

	    private string GetWord(string key, string lang)
	    {
	        string word = Langs.GetWord("notifications", key, lang);
	        return word;
        }
        
        public NotificationDO NewAccountNotification(string userId)
		{
            var userIdObj = new ObjectId(userId);
            var user = DB.FOD<UserEntity>(u => u.User_id == userIdObj);

            return new NotificationDO
			{
				Title = GetWord("NewUserWelcomeTitle", user.DefaultLang), 
				Content = GetWord("NewUserWelcomeBody", user.DefaultLang),
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

            var recUserId = new ObjectId(receiverId);
            var receivingUser = DB.FOD<UserEntity>(u => u.User_id == recUserId);

            return new NotificationDO
			{
				Title = string.Format(GetWord("FriendshipRequestTitle", receivingUser.DefaultLang), requestingUser.DisplayName),
				Content = GetWord("FriendshipRequestBody", receivingUser.DefaultLang),
                Link = "Friends/List",
                LinkText = GetWord("FriendshipRequestLink", receivingUser.DefaultLang),
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

            var toUserIdObj = new ObjectId(toUserId);
            var toUser = DB.FOD<UserEntity>(u => u.User_id == toUserIdObj);


            var tripIdObj = new ObjectId(tripId);
		    var trip = DB.FOD<TripEntity>(t => t.id == tripIdObj);

			var notif = new NotificationDO
			{
				Title = string.Format(GetWord("TripInvitationTitle", toUser.DefaultLang), fromUser.DisplayName),
				UserId = toUserId,
				Status = NotificationStatus.Created,
                Link = $"Trip/Overview/{tripId}",
                LinkText = GetWord("TripInvitationLink", toUser.DefaultLang),

                Content = string.Format(GetWord("TripInvitationBody", toUser.DefaultLang), trip.Name, fromUser.DisplayName, trip.Description),
				ContentType = ContentType.Text,
                Created = DateTime.UtcNow
            };

			return notif;
		}

	}
}