using System.Threading.Tasks;

namespace Gloobster.DomainInterfaces.UserLogs
{
    public interface ITripUserLog
    {
        Task Change(string userId, string entityId);
    }
}