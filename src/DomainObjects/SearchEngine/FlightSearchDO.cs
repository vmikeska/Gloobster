﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;

namespace Gloobster.DomainObjects.SearchEngine
{
    public class FlightSearchDO
    {
        public string FromPlace { get; set; }
        public string ToPlace { get; set; }

        //todo: optimize by one number
        public Date FromDate { get; set; }
        public Date ToDate { get; set; }

        public List<FlightRecordDO> Flights { get; set; }
    }

    public class FlightRecordDO
    {
        public string From { get; set; }
        public string To { get; set; }

        public double Price { get; set; }
        public int Connections { get; set; }
        public double HoursDuration { get; set; }

        public double FlightScore { get; set; }

        public List<FlightPartDO> FlightParts { get; set; }

        public string FlightPartsStr
        {
            get
            {
                var prts = FlightParts.Select(f => $"{f.From}-->{f.To} || {f.DeparatureTime} - {f.ArrivalTime}");
                return string.Join("<br/>", prts);
            }
        }
    }

    public class FlightPartDO
    {
        public DateTime DeparatureTime { get; set; }
        public DateTime ArrivalTime { get; set; }

        public string From { get; set; }
        public string To { get; set; }
    }
    
}