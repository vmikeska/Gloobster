using System;
using System.Collections.Generic;
using System.Linq;
using Gloobster.Common;
using Gloobster.DomainInterfaces.SearchEngine;
using Gloobster.DomainObjects.SearchEngine;

namespace Gloobster.DomainModels.SearchEngine
{
    public class SkypickerSearchProvider : IFlightSearchProvider
    {
        public const string BaseUrl = "https://api.skypicker.com/";
        public const string Endpoint = "flights";

        public FlightSearchDO Search(FlightQueryDO query)
        {
            var caller = new Calls();

            var qb = new QueryBuilder();
            qb
                .BaseUrl(BaseUrl)
                .Endpoint(Endpoint)
                .Param("flyFrom", query.FromPlace)
                .Param("to", query.ToPlace)
                .Param("dateFrom", query.FromDate.ToString())
                .Param("dateTo", query.ToDate.ToString())
                .Param("partner", "picky")
                .Param("typeFlight", "round");

            var qe = qb.Build();

            var result = caller.CallServer<SearchResultRoot>(qe);

            List<FlightRecordDO> converted = result.data.Select(f => Convert(f)).ToList();

            var flightSearch = new FlightSearchDO
            {
                FromPlace = query.FromPlace,
                ToPlace = query.ToPlace,
                FromDate = query.FromDate,
                ToDate = query.ToDate,
                Flights = converted
            };

            return flightSearch;
        }

        private FlightRecordDO Convert(FlightSearchResult flight)
        {
            var flightParts = new List<FlightPartDO>();
            foreach (var route in flight.route)
            {
                var flightPart = new FlightPartDO
                {
                    From = route.flyFrom,
                    To = route.flyTo,
                    DeparatureTime = ConvertDate(route.dTime),
                    ArrivalTime = ConvertDate(route.aTime)
                };
                flightParts.Add(flightPart);
            }

            var res = new FlightRecordDO
            {
                Price = flight.price,
                HoursDuration = GetDuration(flight.fly_duration),
                Connections = flight.route.Count,
                From = flight.flyFrom,
                To = flight.flyTo,
                FlightParts = flightParts
            };
            return res;
        }

        private DateTime ConvertDate(int seconds)
        {
            var date = new DateTime(1970, 1, 1);
            date = date.AddSeconds(seconds);
            return date;
        }

        private double GetDuration(string time)
        {
            var prms = time.Split(' ');
            double res = double.Parse(prms[0].Replace("h", ""));
            double mins = double.Parse(prms[1].Replace("m", ""));

            if (mins > 0)
            {
                res += (60/mins);
            }
            return res;
        }
        
    }
}