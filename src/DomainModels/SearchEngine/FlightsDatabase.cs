using System;
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
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

        public WeekendSearchResultDO GetQueryResults(FlightWeekendQueryDO query)
        {
            var result = new WeekendSearchResultDO { From = query.FromPlace, To = query.MapId, Type = query.Type, Connections = new List<WeekendConnectionDO>()};

            var r = DB.FOD<SkypickerQueryEntity>(q => 
                q.FromPlace == query.FromPlace 
                && q.ToPlace == query.Id 
                && q.ToPlaceType == query.Type);

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
                ToPlaceMap = query.MapId,
                ToPlaceType = query.Type,
                FirstSearchStarted = true,
                FirstSearchFinished = false,
                FoundConnectionsBetweenAirports = new List<FromToSE>(),
                Weekends = new List<WeekendSE>()
            };
            await DB.SaveAsync(startEntity);
            var filter = DB.F<SkypickerQueryEntity>().Eq(f => f.id, startEntity.id);

            var dates = GetWeekendDateComibnations();

            var searches = new List<FlightSearchDO>();
            foreach (DateCombi date in dates)
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
                search.WeekNo = date.WeekNo;
                search.Year = date.Year;
                searches.Add(search);
            }

            //Parallel.ForEach(files, (currentFile) =>
            //{
            //    // The more computational work you do here, the greater 
            //    // the speedup compared to a sequential foreach loop.
            //    String filename = System.IO.Path.GetFileName(currentFile);
            //    var bitmap = new Bitmap(currentFile);

            //    bitmap.RotateFlip(RotateFlipType.Rotate180FlipNone);
            //    bitmap.Save(Path.Combine(newDir, filename));

            //    // Peek behind the scenes to see how work is parallelized.
            //    // But be aware: Thread contention for the Console slows down parallel loops!!!

            //    Console.WriteLine("Processing {0} on thread {1}", filename, Thread.CurrentThread.ManagedThreadId);
            //    //close lambda expression and method invocation
            //});


            //give score to flights
            var weekends = new List<WeekendConnectionEntity>();
            var allScoredFlights = new List<FlightDO>();
            foreach (var search in searches)
            {
                //todo: should do something with rejected flights
                var scoredFlights = FilterFlightsByScore(search.Flights);                
                var passedFlights = scoredFlights.Passed;
                allScoredFlights.AddRange(passedFlights);

                var flightsFromToGrouped = passedFlights.GroupBy(g => new {g.From, g.To}).ToList();

                foreach (var gf in flightsFromToGrouped)
                {
                    string from = gf.Key.From;
                    string to = gf.Key.To;

                    List<FlightDO> flights = gf.ToList();

                    var weekend = GetOrCreateWeekend(weekends, from, to, query.MapId);
                    var weekGroup = new WeekendGroupSE
                    {
                        Flights = flights.Select(f => f.ToEntity()).ToList(),
                        Year = search.Year,
                        WeekNo = search.WeekNo,
                        FromPrice = flights.Select(p => p.Price).Min()
                    };
                    weekend.WeekFlights.Add(weekGroup);
                }                
            }
            await DB.SaveManyAsync(weekends);
          
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

        private WeekendConnectionEntity GetOrCreateWeekend(List<WeekendConnectionEntity> items, string from, string to, string toMapId)
        {
            var item = items.FirstOrDefault(i => i.FromAirport == from && i.ToAirport == to);
            bool exists = item != null;
            if (exists)
            {
                return item;
            }

            var weekend = new WeekendConnectionEntity
            {
                id = ObjectId.GenerateNewId(),
                FromAirport = from,
                ToAirport = to,
                ToMapId = toMapId,
                WeekFlights = new List<WeekendGroupSE>()
            };
            items.Add(weekend);
            return weekend;
        }

        private ScoredFlights FilterFlightsByScore(List<FlightDO> allFlights)
        {
            var res = new ScoredFlights
            {
                Discarded = new List<FlightDO>(),
                Passed = new List<FlightDO>()
            };
            
            foreach (var f in allFlights)
            {
                double? score = ScoreEngine.EvaluateFlight(f);

                if (!score.HasValue)
                {
                    res.Discarded.Add(f);
                    continue;
                }

                f.FlightScore = score.Value;
                if (score >= 0.5)
                {
                    res.Passed.Add(f);
                }
                else
                {
                    res.Discarded.Add(f);
                }
            }

            return res;
        }

        private List<DateCombi> GetWeekendDateComibnations()
        {
            int countOfWeekends = 5;

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
                        WeekNo = DateTimeFormatInfo.CurrentInfo.Calendar.GetWeekOfYear(now, CalendarWeekRule.FirstDay, DayOfWeek.Monday),
                        Year = now.Year
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

        private List<WeekendConnectionEntity> GetConnectionsBetweenAirports(List<FromToSE> fromTos)
        {
            var conns = new List<WeekendConnectionEntity>();
            foreach (var fromTo in fromTos)
            {
                var conn = DB.FOD<WeekendConnectionEntity>(c => c.FromAirport == fromTo.From && c.ToAirport == fromTo.To);
                conns.Add(conn);
            }

            return conns;
        }
    }

    public class ScoredFlights
    {
        public List<FlightDO> Passed;
        public List<FlightDO> Discarded;
    }
}