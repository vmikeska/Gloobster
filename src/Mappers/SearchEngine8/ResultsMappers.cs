using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.DomainObjects.SearchEngine8;
using Gloobster.Entities.SearchEngine;
using Gloobster.ReqRes.SearchEngine8;

namespace Gloobster.Mappers.SearchEngine8
{
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
                bl = d.BookLink,
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

                from = d.From,

                to = d.To,
                toType = d.ToType,
                toName = d.ToName,
                prms = d.Prms
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
}
