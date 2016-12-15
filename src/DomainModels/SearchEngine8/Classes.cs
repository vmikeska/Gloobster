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
    public enum QueryState8 { Saved, Started, Finished, Failed }
    public enum TimeType8 { Anytime, Weekend, Custom }

    //------classes------

    public static class ResultsMappers
    {
        public static AnytimeResultDO ToDO(this AnytimeResultsEntity e)
        {
            var d = new AnytimeResultDO
            {
                FromAir = e.FromAir,
                CC = e.CC,
                GID = e.GID,
                Name = e.Name,
                ToAir = e.ToAir,
                Flights = e.Flights.Select(f => f.ToDO()).ToList()
            };
            return d;
        }

        public static WeekendResultDO ToDO(this WeekendResultsEntity e)
        {
            var d = new WeekendResultDO
            {
                FromAir = e.FromAir,
                CC = e.CC,
                GID = e.GID,
                Name = e.Name,
                ToAir = e.ToAir,
                Flights = e.Flights.Select(f => f.ToDO()).ToList(),

                Year = e.Year,
                Week = e.Week
            };
            return d;
        }

        public static CustomResultDO ToDO(this CustomResultsEntity e)
        {
            var d = new CustomResultDO
            {
                FromAir = e.FromAir,
                CC = e.CC,
                GID = e.GID,
                Name = e.Name,
                ToAir = e.ToAir,
                Flights = e.Flights.Select(f => f.ToDO()).ToList(),

                UserId = e.UserId,
                CustomId = e.CustomId
            };
            return d;
        }

        public static AnytimeResultResponse ToResponse(this AnytimeResultDO d)
        {
            var r = new AnytimeResultResponse
            {
                cc = d.CC,
                from = d.FromAir,
                to = d.ToAir,
                gid = d.GID,
                name = d.Name,
                fs = d.Flights.Select(f => f.ToResponse()).ToList()                
            };

            return r;
        }

        public static WeekendResultResponse ToResponse(this WeekendResultDO d)
        {
            var r = new WeekendResultResponse
            {
                cc = d.CC,
                from = d.FromAir,
                to = d.ToAir,
                gid = d.GID,
                name = d.Name,
                fs = d.Flights.Select(f => f.ToResponse()).ToList(),

                week = d.Week,
                year = d.Year                
            };

            return r;
        }

        public static CustomResultResponse ToResponse(this CustomResultDO d)
        {
            var r = new CustomResultResponse
            {
                cc = d.CC,
                from = d.FromAir,
                to = d.ToAir,
                gid = d.GID,
                name = d.Name,
                fs = d.Flights.Select(f => f.ToResponse()).ToList(),

                cid = d.CustomId,
                uid = d.UserId                
            };

            return r;
        }

        public static FlightResponse ToResponse(this FlightDO d)
        {
            var r = new FlightResponse
            {
                to = d.To,
                from = d.From,
                days = d.DaysInDestination,
                hrs = d.HoursDuration,
                price = d.Price,
                score = d.FlightScore,
                parts = d.FlightParts.Select(p => p.ToResponse()).ToList()
            };

            return r;
        }

        public static FlightPartResponse ToResponse(this FlightPartDO d)
        {
            var r = new FlightPartResponse
            {
                to = d.To,
                from = d.From,
                air = d.Airline,
                arr = d.ArrivalTime,
                dep = d.DeparatureTime,
                mins = d.MinsDuration,
                no = d.FlightNo
            };

            return r;
        }

        public static FlightQueryResultResponse<T, TY> ToResponse<T, TY>(this FlightQueryResult8DO<T> d) 
        {
            var r = new FlightQueryResultResponse<T, TY>
            {
                qid = d.QueryId,
                state = d.State,

                to = d.To,
                toType = d.ToType
            };

            if (d.Results != null)
            {
                if (typeof(T) == typeof(AnytimeResultDO))
                {
                    var rs = d.Results.Select(e => (e as AnytimeResultDO).ToResponse()).ToList();
                    r.results = rs as List<TY>;
                }

                if (typeof(T) == typeof(WeekendResultDO))
                {
                    var rs = d.Results.Select(e => (e as WeekendResultDO).ToResponse()).ToList();
                    r.results = rs as List<TY>;
                }

                if (typeof(T) == typeof(CustomResultDO))
                {
                    var rs = d.Results.Select(e => (e as CustomResultDO).ToResponse()).ToList();
                    r.results = rs as List<TY>;
                }
            }

            return r;
        }
    }


    public class FlightQueryResultResponse<T, TY>
    {
        public string qid { get; set; }
        public QueryState8 state { get; set; }

        public string to { get; set; }
        public PlaceType8 toType { get; set; }

        public List<TY> results { get; set; }
    }

    public class AnytimeResultResponse
    {
        public string from { get; set; }
        public string to { get; set; }

        public int gid { get; set; }
        public string name { get; set; }
        public string cc { get; set; }

        public List<FlightResponse> fs { get; set; }
    }

    public class WeekendResultResponse
    {
        public string from { get; set; }
        public string to { get; set; }

        public int gid { get; set; }
        public string name { get; set; }
        public string cc { get; set; }

        public List<FlightResponse> fs { get; set; }

        public int week { get; set; }
        public int year { get; set; }
        
    }

    public class CustomResultResponse
    {
        public string from { get; set; }
        public string to { get; set; }

        public int gid { get; set; }
        public string name { get; set; }
        public string cc { get; set; }

        public string uid { get; set; }
        public string cid { get; set; }

        public List<FlightResponse> fs { get; set; }        
    }

    
    public class FlightResponse
    {
        public string from { get; set; }
        public string to { get; set; }

        public double price { get; set; }        
        public double score { get; set; }
        
        public double hrs { get; set; }
        public int days { get; set; }

        public List<FlightPartResponse> parts { get; set; }
    }

    public class FlightPartResponse
    {
        public string from { get; set; }
        public string to { get; set; }

        public DateTime dep { get; set; }
        public DateTime arr { get; set; }
        
        public string air { get; set; }
        public int no { get; set; }

        public int mins { get; set; }
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

    public class AnytimeResultsEntity: EntityBase
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

        public string To { get; set; }
        public PlaceType8 ToType { get; set; }

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
    
    //---inters-----

    public interface IClientRequestExecutor
    {
        Task<List<FlightQueryResult8DO<T>>> ExeFirstRequestAsync<T>(string userId, TimeType8 timeType, string customId = null);

        Task<List<FlightQueryResult8DO<T>>> ExeSingleRequestsAsync<T>(string userId, TimeType8 timeType, DestinationRequests8DO dests, string customId = null);

        List<FlightQueryResult8DO<T>> ExeRequery<T>(List<string> ids);
    }

    public interface IKiwiResultSaver<T>
    {
        List<T> BuildEntities(List<GroupedResultDO> groups, string queryId);
    }

    public interface IQueryBuilder
    {
        FlightRequestDO BuildCountry(string airCode, string cc);
        FlightRequestDO BuildCity(string airCode, int gid);
    }

    public interface IRequestsBuilder8
    {
        List<FlightQuery8DO> BuildQueriesAnytime(DestinationRequests8DO destinations, string userId);
        List<FlightQuery8DO> BuildQueriesWeekend(DestinationRequests8DO destinations, string userId);
        List<FlightQuery8DO> BuildQueriesCustom(DestinationRequests8DO destinations, string userId, string searchId);
    }

    public interface IRequestBuilder8
    {
        FlightQuery8DO BuildQueryAnytimeCity(string fromAir, int gid);

        FlightQuery8DO BuildQueryAnytimeCountry(string fromAir, string cc);

        FlightQuery8DO BuildQueryWeekendCity(string fromAir, int gid, int week, int year);

        FlightQuery8DO BuildQueryWeekendCountry(string fromAir, string cc, int week, int year);

        FlightQuery8DO BuildQueryCustomCity(string fromAir, int gid, string userId, string searchId);

        FlightQuery8DO BuildQueryCustomCountry(string fromAir, string cc, string userId, string searchId);
    }

    public interface IFlightsDb8
    {
        Task<FlightQueryResult8DO<T>> GetResultsAsync<T>(FlightQuery8DO q);
        List<FlightQueryResult8DO<T>> CheckOnResults<T>(List<string> ids);
    }

    public interface IFlightsBigDataCalculator
    {
        void Process(ScoredFlightsDO evalFlights);
    }

    public interface IKiwiResultsExecutor
    {
        List<FlightDO> Search(FlightRequestDO req);
    }

    public interface IKiwiResultsProcessor
    {
        Task ProcessFlightsAsync(List<FlightDO> flights, TimeType8 timeType, string queryId, string prms);
    }

    public interface IQueriesExecutor
    {
        void ExecuteQueriesAsync();
        Task DeleteOldQueriesAsync();
    }

}
