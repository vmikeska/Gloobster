using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface INotificationsDomain
	{
		void AddNotification(NotificationDO notification);
		INotifications Messages { get; set; }
        Task<bool> DeleteNotification(string userId, string id);
	    Task<bool> DeleteAllNotifications(string userId);
	    Task<bool> SetAllNotificationsToSeen(string userId);
	}

	public interface INotifications
	{
		NotificationDO NewAccountNotification(string userId);
        Task<NotificationDO> FriendshipRequested(string requestorId, string receiverId);
        Task<NotificationDO> TripInvitation(string fromUserId, string toUserId, string tripId);	    
	}
}