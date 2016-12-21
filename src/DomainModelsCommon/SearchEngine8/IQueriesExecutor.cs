using System;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;

namespace Gloobster.DomainInterfaces.SearchEngine8
{
    public interface IQueriesExecutor
    {
        void ExecuteQueriesAsync();
        Task DeleteOldQueriesAsync();
    }
}
