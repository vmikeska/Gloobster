using System.Threading.Tasks;

namespace Gloobster.DomainInterfaces.UserLogs
{
    public interface IFriendsUserLog
    {
        Task Change(string userId, string friendId);
    }
}