using Gloobster.DomainObjects;
using Gloobster.DomainObjects.SearchEngine;

namespace Gloobster.DomainInterfaces.SearchEngine
{
    public interface IFlightScoreEngine
    {
        double EvaluateFlight(FlightRecordDO flight);
    }
}