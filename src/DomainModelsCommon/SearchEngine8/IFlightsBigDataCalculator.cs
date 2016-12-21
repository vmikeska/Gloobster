using Gloobster.DomainObjects.SearchEngine;
using Gloobster.DomainObjects.SearchEngine8;

namespace Gloobster.DomainInterfaces.SearchEngine8
{
    public interface IFlightsBigDataCalculator
    {
        void Process(ScoredFlightsDO evalFlights);
    }
}