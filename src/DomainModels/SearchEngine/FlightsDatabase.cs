using System.Collections.Generic;
using System.Linq;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces.SearchEngine;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Entities;
using Gloobster.Entities.SearchEngine;
using Gloobster.Enums.SearchEngine;
using Gloobster.Mappers;

namespace Gloobster.DomainModels.SearchEngine
{
    public class FlightsDatabase: IFlightsDatabase
    {
        public bool UseCache = false;

        public IFlightsCache Cache { get; set; }
        public IDbOperations DB { get; set; }
        public IFlightScoreEngine ScoreEngine { get; set; }

        //currently we don't have more providers
        private IFlightSearchProvider Provider = new SkypickerSearchProvider();

        private static List<NewAirportEntity> Airports;

        public List<FlightSearchDO> GetFlights(FlightRecordQueryDO query)
        {
            if (Airports == null)
            {
                Airports = DB.List<NewAirportEntity>();
            }

            if (query.Type == FlightCacheRecordType.City)
            {
                int gid = int.Parse(query.Id);
                
                var airports = Airports.Where(c => c.GID == gid);
                var airportCodes = airports.Select(c => c.Code).ToList();

                var outFlights = new List<FlightSearchDO>();
                foreach (var airportCode in airportCodes)
                {
                    var airQuery = new FlightQueryDO
                    {
                        FromDate = query.FromDate,
                        ToDate = query.ToDate,
                        FromPlace = query.FromPlace,
                        ToPlace = airportCode
                    };

                    var flights = GetFromCacheOrQuery(airQuery);
                    outFlights.Add(flights);
                }

                return outFlights;
            }

            //if (query.Type == FlightCacheRecordType.Country)
            //{
            //    //todo
            //}

            return null;
        }
        
        //the older method for testing
        public FlightSearchDO GetFlights(FlightQueryDO query)
        {
            var flights = Provider.Search(query);            
            return flights;
        }

        private FlightSearchDO GetFromCacheOrQuery(FlightQueryDO query)
        {
            const double scoreThreshold = 0.5;

            if (UseCache)
            {
                var cachedFlights = Cache.GetAirportConnections(query);
                if (cachedFlights != null)
                {
                    return cachedFlights;
                }
            }

            FlightSearchDO flightSearch = Provider.Search(query);

            var passedFlights = new List<FlightRecordDO>();
            foreach (FlightRecordDO flightRecord in flightSearch.Flights)
            {
                //todo: check FlightRecord is from just one airport to another, no combi records

                double score = ScoreEngine.EvaluateFlight(flightRecord);

                if (score >= scoreThreshold)
                {
                    flightRecord.FlightScore = score;
                    passedFlights.Add(flightRecord);
                }                
            }

            if (UseCache)
            {
                Cache.CacheQuery(query, passedFlights);
            }

            flightSearch.Flights = passedFlights;
            return flightSearch;

            //todo: group
        }


    }

    public class DateCombi
    {
        public Date FromDate { get; set; }
        public Date ToDate { get; set; }
    }

    public class StopRating
    {
        public StopRating(int count, double rating)
        {
            Count = count;
            Rating = rating;
        }
        
        public int Count;
        public double Rating;
    }
}