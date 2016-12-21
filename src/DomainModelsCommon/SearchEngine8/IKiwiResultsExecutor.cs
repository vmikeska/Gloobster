using System.Collections.Generic;
using Gloobster.DomainObjects.SearchEngine;

namespace Gloobster.DomainInterfaces.SearchEngine8
{
    public interface IKiwiResultsExecutor
    {
        List<FlightDO> Search(FlightRequestDO req);
    }
}