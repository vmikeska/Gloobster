using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Entities.TravelB;
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

        public NotificationDO TripRequestToJoinNotification(string tripId, string userId, string ownerId)
        {
            var userIdObj = new ObjectId(userId);
            var user = DB.FOD<UserEntity>(u => u.User_id == userIdObj);

            var tidObj = new ObjectId(tripId);
            var trip = DB.FOD<TripEntity>(u => u.id == tidObj);

            var titleTmp = GetWord("TripRequestTitle", user.DefaultLang);
            var title = string.Format(titleTmp, user.DisplayName, trip.Name);
            
            return new NotificationDO
            {
                Title = title,
                Content = GetWord("TripRequestBody", user.DefaultLang),
                ContentType = ContentType.Text,
                UserId = ownerId,
                Status = NotificationStatus.Created,
                Created = DateTime.UtcNow,
                Link = $"{RoutingConsts.TripEditMenuName}/{tripId}",
                LinkText = GetWord("TripRequestLink", user.DefaultLang)
            };
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

	    public NotificationDO ReactingToCheckin(string reactId, string requestingUserId, string receiverId)
	    {
            //leave it here, maybe you want to use it
            //var ridObj = new ObjectId(reactId);
            //var react = DB.FOD<CheckinReactionEntity>(r => r.id == ridObj);

            //usage for translation later
            var recUserId = new ObjectId(receiverId);
            //var receivingUser = DB.FOD<UserEntity>(u => u.User_id == recUserId);

            var requestingUserIdObj = new ObjectId(requestingUserId);
            var requestingUser = DB.FOD<UserEntity>(u => u.User_id == requestingUserIdObj);
            
            //todo: translate
            return new NotificationDO
            {
                Title = $"User {requestingUser.DisplayName} wants start chat with you",
                Content = "Do you want to start chat with him ? Got to the page and confirm it.",
                Link = "TravelB/Home",
                LinkText = "Go to page",
                ContentType = ContentType.Text,
                UserId = receiverId,
                Status = NotificationStatus.Created,
                Created = DateTime.UtcNow
            };
        }

        public NotificationDO ConfirmsChatRequest(string reactiId, string confirmerId, string receiverId)
        {
            var confirmerIdObj = new ObjectId(confirmerId);
            var confirmingUser = DB.FOD<UserEntity>(u => u.User_id == confirmerIdObj);

            //todo: translate
            return new NotificationDO
            {
                Title = $"User {confirmingUser.DisplayName} just confirmed your chat request.",
                Content = "You can now start chatting.",
                Link = "TravelB/Home",
                LinkText = "Go to page",
                ContentType = ContentType.Text,
                UserId = receiverId,
                Status = NotificationStatus.Created,
                Created = DateTime.UtcNow
            };
        }

        public List<NotificationDO> RateMeeting(string reactId)
	    {
	        var ridObj = new ObjectId(reactId);

	        var react = DB.FOD<CheckinReactionEntity>(r => r.id == ridObj);

	        var not1 = MetNotif(react.AskingUser_id.ToString(), react.TargetUser_id.ToString());
            var not2 = MetNotif(react.TargetUser_id.ToString(), react.AskingUser_id.ToString());

            return new List<NotificationDO> { not1, not2};
	    }

	    private NotificationDO MetNotif(string receiverId, string ratedUserId)
	    {
            //you will user is for the lang
            var recUserIdObj = new ObjectId(receiverId);
            var receivingUser = DB.FOD<UserEntity>(u => u.User_id == recUserIdObj);

            var ratedUserIdObj = new ObjectId(ratedUserId);
            var ratedUser = DB.FOD<UserEntity>(u => u.User_id == ratedUserIdObj);

            //todo: translate
            return new NotificationDO
            {
                Title = $"Rating of meeting with {ratedUser.DisplayName}",
                Content = "Do you want to rate this user ?",
                Link = $"TravelB/UserRating/{ratedUserId}",
                LinkText = "Rate",
                ContentType = ContentType.Text,
                UserId = receiverId,
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
                Link = RoutingConsts.FriendsMenuName,
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
                Link = $"{RoutingConsts.TripMenuName}/{tripId}",
                LinkText = GetWord("TripInvitationLink", toUser.DefaultLang),

                Content = string.Format(GetWord("TripInvitationBody", toUser.DefaultLang), trip.Name, fromUser.DisplayName, trip.Description),
				ContentType = ContentType.Text,
                Created = DateTime.UtcNow
            };

			return notif;
		}

	}
}