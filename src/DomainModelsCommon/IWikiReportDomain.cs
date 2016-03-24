using System.Threading.Tasks;
using Gloobster.DomainObjects;
using Gloobster.Enums;

namespace Gloobster.DomainInterfaces
{
    public interface IWikiReportDomain
    {
        Task<bool> CreateReport(NewReportDO newReport);
        Task<bool> SetState(string reportId, AdminTaskState state);
    }
}