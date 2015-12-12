using System.Collections.Generic;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface INotificationsDomain
	{
		void AddNotification(NotificationDO notification);
		INotifications Messages { get; set; }
	}

	public interface INotifications
	{
		NotificationDO NewAccountNotification(string userId);
		NotificationDO FriendshipRequested(string requestorId, string receiverId);
		NotificationDO TripInvitation(string fromUserId, string toUserId, string tripId);

	}
}