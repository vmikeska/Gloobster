using System;
using System.Collections.Generic;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.Enums.SearchEngine;

namespace Gloobster.Entities.SearchEngine
{
    public class SkypickerQueryEntity : EntityBase
    {
        public string FromPlace { get; set; }
        public string ToPlace { get; set; }

        public FlightCacheRecordType ToPlaceType { get; set; }

        public List<FromToSE> FoundConnectionsBetweenAirports { get; set; }

        public List<WeekendSE> Weekends { get; set; }

        public bool FirstSearchFinished { get; set; }
        public bool FirstSearchStarted { get; set; }


        //Anytime start later
        //public List<Query> Queries;

    }

    public class FromToSE
    {
        public string From { get; set; }
        public string To { get; set; }
        //maybe a hash id to reference the connection ?

    }

    public class WeekendSE
    {
        public int Number { get; set; }
        public int Year { get; set; }

        public DateTime LastQueryNormal { get; set; }
        public DateTime LastQueryLong { get; set; }
    }

    //Anytime start later
    //public class Query
    //{
    //    public Date FromDate;
    //    public Date ToDate;

    //    public DateTime LastQuery;
    //}

}