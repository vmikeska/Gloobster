using System.Threading.Tasks;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface IFriendsDomain
	{		
        Task<bool> RequestFriendship(string myDbUserId, string friendDbUserId);
		Task<bool> AddEverbodyToMyFriends(string dbUserId);

		Task<FriendsDO> CreateFriendsObj(string dbUserId);
	}
}