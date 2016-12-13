using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainModels.SearchEngine;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Entities;
using Gloobster.Entities.Planning;
using Gloobster.Entities.SearchEngine;
using Gloobster.Mappers;
using Hammock;
using MongoDB.Bson;

namespace Gloobster.DomainModels.SearchEngine8
{   
    //----enums-------

    public enum PlaceType8 { City, Country }
    public enum QueryState8 { Saved, Started, Finished }
    public enum TimeType8 { Anytime, Weekend, Custom }

    //------classes------

    public interface IQueryBuilder
    {
        FlightRequestDO BuildCountry(string airCode, string cc);
        FlightRequestDO BuildCity(string airCode, int gid);
    }

    public class QueryEntity: EntityBase
    {
        public QueryState8 State { get; set; }
        
        public string FromAir { get; set; }
        public string To { get; set; }
        public PlaceType8 ToType { get; set; }
        public string Params { get; set; }
        public TimeType8 TimeType { get; set; }

        public DateTime Created { get; set; }
        public DateTime? Executed { get; set; }
    }

    public class FlightQueryResult8DO
    {
        public string QueryId { get; set; }
        public QueryState8 State { get; set; }

        //?
        public object Result { get; set; }
    }

    public class WeeksCombi
    {
        public int Year { get; set; }
        public int WeekNo { get; set; }        
    }


    public class DestinationRequests8DO
    {
        public List<string> CCs { get; set; }
        public List<int> GIDs { get; set; }
    }

    public class FlightQuery8DO
    {
        public string FromAir { get; set; }
        public string To { get; set; }
        public PlaceType8 ToType { get; set; }
        public string Params { get; set; }
        public TimeType8 TimeType { get; set; }
    }

    public class DateRange
    {
        public Date FromDate { get; set; }
        public Date ToDate { get; set; }
    }
}
