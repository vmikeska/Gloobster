using System;
using Gloobster.Database;
using Gloobster.Enums.SearchEngine;

namespace Gloobster.Entities.SearchEngine
{
    public class QueryEntity : EntityBase
    {
        public QueryState State { get; set; }

        public string FromAir { get; set; }
        public string To { get; set; }
        public PlaceType ToType { get; set; }
        public string Params { get; set; }
        public TimeType TimeType { get; set; }

        public DateTime Created { get; set; }
        public DateTime? Executed { get; set; }

        public int Restarted { get; set; }
    }
}