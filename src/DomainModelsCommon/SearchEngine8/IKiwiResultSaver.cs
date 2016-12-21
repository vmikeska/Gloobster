using System.Collections.Generic;
using Gloobster.DomainObjects.SearchEngine8;

namespace Gloobster.DomainInterfaces.SearchEngine8
{
    public interface IKiwiResultSaver<T>
    {
        List<T> BuildEntities(List<GroupedResultDO> groups, string queryId);
    }
}