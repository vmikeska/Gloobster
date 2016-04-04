using System.Threading.Tasks;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
    public interface IPinBoardStats
    {
        Task<PinBoardStatsResultDO> GetStatsAsync(string userId);
    }
}