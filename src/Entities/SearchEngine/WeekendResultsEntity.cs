using System.Collections.Generic;
using Gloobster.Database;
using MongoDB.Bson;

namespace Gloobster.Entities.SearchEngine
{
    public class WeekendResultsEntity : EntityBase
    {
        public ObjectId Query_id { get; set; }

        public string FromAir { get; set; }
        public string ToAir { get; set; }

        public int GID { get; set; }
        public string Name { get; set; }
        public string CC { get; set; }

        public int Week { get; set; }
        public int Year { get; set; }

        public List<FlightSE> Flights { get; set; }
    }
}