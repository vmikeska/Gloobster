using System.Threading.Tasks;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface IFriendsDomain
	{
		Task<bool> Unfriend(string myDbUserId, string friendDbUserId);
        Task<bool> ConfirmFriendship(string myDbUserId, string friendDbUserId);
        Task<bool> RequestFriendship(string myDbUserId, string friendDbUserId);		
	    Task<bool> CancelRequest(string myDbUserId, string friendDbUserId);
	    Task<bool> Block(string myDbUserId, string friendDbUserId);

        //Task<bool> AddEverbodyToMyFriends(string dbUserId);
        //Task<FriendsDO> CreateFriendsObj(string dbUserId);
    }
}