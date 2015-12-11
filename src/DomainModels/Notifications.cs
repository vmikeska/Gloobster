using System.Linq;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
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
				Title = "You are now registered",
				Content = "Welcome on our portal",
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
				Content = "Confirm it",
				ContentType = ContentType.Text,
				UserId = receiverId,
				Status = NotificationStatus.Created
			};
		}

	}
}