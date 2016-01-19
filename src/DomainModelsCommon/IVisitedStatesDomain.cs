using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
    public interface IVisitedStatesDomain
    {
        Task<List<VisitedStateDO>> AddNewStatesAsync(List<VisitedStateDO> inputStates, string userId);
        List<VisitedStateDO> GetStatesOverall();
        List<VisitedStateDO> GetStatesByUsers(List<string> ids, string meId);
    }
}