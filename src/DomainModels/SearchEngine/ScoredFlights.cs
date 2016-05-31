using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces.SearchEngine;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Entities.SearchEngine;
using Gloobster.Mappers;
using MongoDB.Bson;

namespace Gloobster.DomainModels.SearchEngine
{
    public class ScoredFlights
    {
        public List<FlightDO> Passed { get; set; }
        public List<FlightDO> Discarded { get; set; }
    }
}