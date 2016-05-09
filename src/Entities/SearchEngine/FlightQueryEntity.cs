using System;
using System.Collections.Generic;
using Gloobster.Common;
using Gloobster.Database;

namespace Gloobster.Entities.SearchEngine
{
    public class FlightQueryEntity : EntityBase
    {
        public DateTime QueryTime { get; set; }

        public string FromPlace { get; set; }
        public string ToPlace { get; set; }

        public Date FromDate { get; set; }
        public Date ToDate { get; set; }

        public List<FlightSE> Flights { get; set; }
    }
}