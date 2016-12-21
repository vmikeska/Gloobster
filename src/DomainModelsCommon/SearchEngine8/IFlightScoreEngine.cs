using System.Collections.Generic;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.DomainObjects.SearchEngine8;
using Gloobster.Enums.SearchEngine;

namespace Gloobster.DomainInterfaces.SearchEngine8
{
    public interface IFlightScoreEngine
    {
        ScoredFlightsDO FilterFlightsByScore(List<FlightDO> allFlights, ScoreLevel level = ScoreLevel.Standard);
        double? EvaluateFlight(FlightDO flight);
    }
}