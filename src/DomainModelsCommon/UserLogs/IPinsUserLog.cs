using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gloobster.DomainInterfaces.UserLogs
{
    public interface IPinsUserLog
    {
        Task Change(string userId, List<string> displayPlaces, int totalCount);
    }
}