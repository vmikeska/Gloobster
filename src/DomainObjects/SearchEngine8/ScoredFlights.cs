using System.Collections.Generic;
using Gloobster.DomainObjects.SearchEngine;

namespace Gloobster.DomainObjects.SearchEngine8
{
    public class ScoredFlightsDO
    {
        public List<FlightDO> Passed { get; set; }
        public List<FlightDO> Discarded { get; set; }
    }
}