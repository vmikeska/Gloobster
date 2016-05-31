using System;
using System.Collections.Generic;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.Enums.SearchEngine;

namespace Gloobster.Entities.SearchEngine
{
    public class FlightSearchEntity : EntityBase
    {
        public DateTime QueryTime { get; set; }

        public PlaceType Type { get; set; }

        public string FromPlace { get; set; }
        public string ToPlace { get; set; }

        //todo: optimize by one number
        public Date FromDate { get; set; }
        public Date ToDate { get; set; }

        public List<FlightSE> Flights { get; set; }
    }
}