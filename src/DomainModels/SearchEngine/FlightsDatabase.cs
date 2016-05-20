using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces.SearchEngine;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Entities.SearchEngine;
using Gloobster.Enums.SearchEngine;
using Gloobster.Mappers;
using MongoDB.Bson;

namespace Gloobster.DomainModels.SearchEngine
{
    public class FlightsDatabase: IFlightsDatabase
    {
        public IDbOperations DB { get; set; }
        public ISkypickerSearchProvider SpProvider { get; set; }
        public IFlightScoreEngine ScoreEngine { get; set; }

        public FlightSearchResultDO GetQueryResults(FlightWeekendQueryDO query)
        {
            var result = new FlightSearchResultDO { From = query.FromPlace, To = query.Id, Type = query.Type, Connections = new List<ConnectionDO>()};

            var r = DB.FOD<SkypickerQueryEntity>(q => 
                q.FromPlace == query.FromPlace 
                && q.ToPlace == query.Id 
                && q.ToPlaceType == FlightCacheRecordType.City);

            //todo: isFinished, etc. Also later implement recoginition for long and standart weekends and as great finish count a bit with anytime and custom search
            bool doesntExistAtAll = (r == null);
            if (doesntExistAtAll)
            {
                StartQueryForTheFirstTime(query);
                result.QueryStarted = true;
                return result;
            }

            bool searchStartedNotFinished = (r.FirstSearchStarted && !r.FirstSearchFinished);
            if (searchStartedNotFinished)
            {
                result.NotFinishedYet = true;
                return result;
            }

            bool searchStartedAndFinished = (r.FirstSearchStarted && r.FirstSearchFinished);
            if (searchStartedAndFinished)
            {
                var conns = GetConnectionsBetweenAirports(r.FoundConnectionsBetweenAirports);
                result.Connections = conns.Select(c => c.ToDO()).ToList();            
                return result;
            }

            //will not happen
            return null;
        }
        
        private async void StartQueryForTheFirstTime(FlightWeekendQueryDO query)
        {
            var startEntity = new SkypickerQueryEntity
            {
                id = ObjectId.GenerateNewId(),
                FromPlace = query.FromPlace,
                ToPlace = query.Id,
                ToPlaceType = query.Type,
                FirstSearchStarted = true,
                FirstSearchFinished = false,
                FoundConnectionsBetweenAirports = new List<FromToSE>(),
                Weekends = new List<WeekendSE>()
            };
            await DB.SaveAsync(startEntity);
            
            var dates = GetWeekendDateComibnations();

            var searches = new List<FlightSearchDO>();
            foreach (var date in dates)
            {
                var provQuery = new FlightRequestDO
                {
                    flyFrom = query.FromPlace,
                    to = query.Id,
                    dateFrom = date.FromDate.ToString(),
                    dateTo = date.ToDate.ToString(),

                    //todo: rework then to something more specific
                    daysInDestinationFrom = "2",
                    daysInDestinationTo = "3"
                };

                FlightSearchDO search = SpProvider.Search(provQuery);
                searches.Add(search);
            }

            var allFlights = searches.SelectMany(f => f.Flights).ToList();

            var filter = DB.F<SkypickerQueryEntity>().Eq(f => f.id, startEntity.id);
            
            var groupedFlightsObj = allFlights.GroupBy(g => new { g.From, g.To }).ToList();
            var allScoredFlights = new List<FlightDO>();
            foreach (var gf in groupedFlightsObj)
            {
                string from = gf.Key.From;
                string to = gf.Key.To;

                List<FlightDO> groupedFlights = gf.ToList();

                var scoredGroupedFlights = new List<FlightDO>();
                foreach (var f in groupedFlights)
                {
                    double score = ScoreEngine.EvaluateFlight(f);
                    if (score >= 0.5)
                    {
                        f.FlightScore = score;
                        scoredGroupedFlights.Add(f);
                        allScoredFlights.Add(f);
                    }
                }
                //todo: should somehow possibly take flight and data out of rejected
                var flights = scoredGroupedFlights.Select(f => f.ToEntity()).ToList();
                var connectionEntity = new ConnectionEntity
                {
                    id = ObjectId.GenerateNewId(),
                    FromAirport = from,
                    ToAirport = to,
                    Flights = flights                    
                };
                
                await DB.SaveAsync(connectionEntity);
            }

            var fromTos = allScoredFlights.Select(fl => new { fl.From, fl.To });
            var fromTosDist = fromTos.Distinct();
            var fromTosDistList = fromTosDist.Select(i => new FromToSE { From = i.From, To = i.To }).ToList();
            var u1 = DB.U<SkypickerQueryEntity>().Set(f => f.FoundConnectionsBetweenAirports, fromTosDistList);
            await DB.UpdateAsync(filter, u1);



            //not yet used
            //ExtractSingleFlights(search);


            var update = DB.U<SkypickerQueryEntity>().Set(f => f.FirstSearchFinished, true);
            await DB.UpdateAsync(filter, update);
        }

        private List<DateCombi> GetWeekendDateComibnations()
        {
            int countOfWeekends = 1;

            var today = DateTime.UtcNow;
            var now = today;
            var outDates = new List<DateCombi>();
            while (outDates.Count <= countOfWeekends)
            {
                now = now.AddDays(1);
                if (now.DayOfWeek == DayOfWeek.Friday)
                {
                    var sunday = now.AddDays(2);
                    var date = new DateCombi
                    {
                        FromDate = new Date(now.Day, now.Month, now.Year),
                        ToDate = new Date(sunday.Day, sunday.Month, sunday.Year),
                        WeekNo = DateTimeFormatInfo.CurrentInfo.Calendar.GetWeekOfYear(now, CalendarWeekRule.FirstDay, DayOfWeek.Monday)
                    };
                    outDates.Add(date);
                }
            }

            return outDates;
        }



        //todo: extract single flights
        private async void ExtractSingleFlights(FlightSearchDO search)
        {            
            var allSingleFlights = search.Flights.SelectMany(f => f.FlightParts).ToList();
            foreach (var flight in allSingleFlights)
            {
                //group and save to appropriate entities
            }
        }

        private List<ConnectionEntity> GetConnectionsBetweenAirports(List<FromToSE> fromTos)
        {
            var conns = new List<ConnectionEntity>();
            foreach (var fromTo in fromTos)
            {
                var conn = DB.FOD<ConnectionEntity>(c => c.FromAirport == fromTo.From && c.ToAirport == fromTo.To);
                conns.Add(conn);
            }

            return conns;
        }
    }
}