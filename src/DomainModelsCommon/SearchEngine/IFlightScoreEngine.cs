using Gloobster.DomainObjects;
using Gloobster.DomainObjects.SearchEngine;
using FlightDO = Gloobster.DomainObjects.SearchEngine.FlightDO;

namespace Gloobster.DomainInterfaces.SearchEngine
{
    public interface IFlightScoreEngine
    {
        double? EvaluateFlight(FlightDO flight);
    }
}