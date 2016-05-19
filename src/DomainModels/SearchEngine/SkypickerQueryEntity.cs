using System;
using System.Collections.Generic;
using Gloobster.Common;

namespace Gloobster.DomainModels.SearchEngine
{
    public class SkypickerQueryEntity
    {
        public string FromPlace;
        public string ToPlace;

        public List<FromTo> FoundConnectionsBetweenAirports;

        public List<Weekend> Weekends;

        //Anytime start later
        public List<Query> Queries;

    }

    public class FromTo
    {
        public string From;
        public string To;
        //maybe a hash id to reference the connection ?

    }

    //Anytime start later
    public class Query
    {
        public Date FromDate;
        public Date ToDate;

        public DateTime LastQuery;
    }



    public class Weekend
    {
        public int Number;
        public int Year;

        public DateTime LastQuery;
        //public DateTime LastQueryLong;
    }






    public class ConnectionEntity
    {
        public string FromAirport;
        public string ToAirport;

        public List<SingleFlight> DirectFlights;
    }

    public class SingleFlight
    {
        public string From;
        public string To;
    }
}