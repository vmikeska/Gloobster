using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
    public interface IExecOperation
    {
        IDbOperations DB { get; set; }
        string Caption { get; }
        string Name { get; }
        Task<bool> Execute(TaskExecuteDO action);
    }
}