using System.Collections.Generic;
using Gloobster.DomainObjects;
using Gloobster.DomainObjects.SearchEngine;
using FlightDO = Gloobster.DomainObjects.SearchEngine.FlightDO;

namespace Gloobster.DomainInterfaces.SearchEngine
{
    public interface IFlightScoreEngine
    {
        ScoredFlightsDO FilterFlightsByScore(List<FlightDO> allFlights);
        double? EvaluateFlight(FlightDO flight);
    }
}