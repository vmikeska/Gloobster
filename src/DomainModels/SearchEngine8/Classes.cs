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
    public class ParamsParsers
    {
        public static WeekendParams Weekend(string prms)
        {
            var ps = prms.Split('_');
            return new WeekendParams
            {
                Week = int.Parse(ps[0]),
                Year = int.Parse(ps[1])
            };
        }

        public static string Weekend(int week, int year)
        {
            var str = $"{week}_{year}";
            return str;
        }

        public static CustomParams Custom(string prms)
        {
            var ps = prms.Split('_');
            return new CustomParams
            {
                UserId = ps[0],
                SearchId = ps[1]
            };            
        }

        public static string Custom(string userId, string searchId)
        {
            var str = $"{userId}_{searchId}";
            return str;
        }
        

    }

    public class CustomParams
    {
        public string UserId;
        public string SearchId;
    }

    public class WeekendParams
    {
        public int Week;
        public int Year;
    }

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

    public class AnytimeResultsEntity : EntityBase
    {
        public ObjectId Query_id { get; set; }

        public string FromAir { get; set; }
        public string ToAir { get; set; }

        public int GID { get; set; }
        public string Name { get; set; }
        public string CC { get; set; }
        
        public List<FlightSE> Flights { get; set; }
    }

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

    public class CustomResultsEntity : EntityBase
    {
        public ObjectId Query_id { get; set; }

        public string FromAir { get; set; }
        public string ToAir { get; set; }

        public int GID { get; set; }
        public string Name { get; set; }
        public string CC { get; set; }

        public string UserId { get; set; }
        public string CustomId { get; set; }

        public List<FlightSE> Flights { get; set; }
    }

    public class FlightQueryResult8DO<T>
    {
        public string QueryId { get; set; }
        public QueryState8 State { get; set; }

        public List<T> Results { get; set; }
    }
    
    public class AnytimeResultDO
    {        
        public string FromAir { get; set; }
        public string ToAir { get; set; }

        public int GID { get; set; }
        public string Name { get; set; }
        public string CC { get; set; }

        public List<FlightDO> Flights { get; set; }
    }

    public class WeekendResultDO
    {
        public string FromAir { get; set; }
        public string ToAir { get; set; }

        public int GID { get; set; }
        public string Name { get; set; }
        public string CC { get; set; }

        public int Week { get; set; }
        public int Year { get; set; }

        public List<FlightDO> Flights { get; set; }
    }

    public class CustomResultDO
    {
        public string FromAir { get; set; }
        public string ToAir { get; set; }

        public int GID { get; set; }
        public string Name { get; set; }
        public string CC { get; set; }

        public string UserId { get; set; }
        public string CustomId { get; set; }

        public List<FlightDO> Flights { get; set; }
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

    public class GroupedResultDO
    {
        public string From { get; set; }
        public string To { get; set; }

        public string CC { get; set; }
        public string Name { get; set; }
        public int GID { get; set; }

        public List<FlightDO> Flights { get; set; }
    }

    public interface IKiwiResultSaver
    {
        List<EntityBase> BuildEntities(List<GroupedResultDO> groups, string queryId);
    }
}
