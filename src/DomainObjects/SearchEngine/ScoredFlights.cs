using System.Collections.Generic;

namespace Gloobster.DomainObjects.SearchEngine
{
    public class ScoredFlightsDO
    {
        public List<FlightDO> Passed { get; set; }
        public List<FlightDO> Discarded { get; set; }
    }
}