using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Gloobster.Common;
using Gloobster.DomainInterfaces.SearchEngine;
using Gloobster.DomainObjects.SearchEngine;

namespace Gloobster.DomainModels.SearchEngine
{
    public class SkypickerSearchProvider : ISkypickerSearchProvider
    {
        public const string BaseUrl = "https://api.skypicker.com/";
        public const string Endpoint = "flights";
        
        public FlightSearchDO Search(FlightRequestDO req)
        {
            var caller = new Calls();

            var qb = new QueryBuilder();
            qb
                .BaseUrl(BaseUrl)
                .Endpoint(Endpoint)

                .Param("partner", "picky")
                .Param("v", "3");


            foreach (var prop in req.GetType().GetProperties())
            {
                var value = prop.GetValue(req, null);
                if (value != null)
                {
                    var str = value.ToString();
                    if (!string.IsNullOrEmpty(str))
                    {
                        if (prop.Name == "Params")
                        {
                            continue;
                        }

                        qb.Param(prop.Name, str);
                        
                    }
                }
            }

            var query = qb.Build();

            var result = caller.CallServer<SearchResultRoot>(query);
            if (result == null)
            {
                return null;
            }

            List<FlightDO> converted = result.data.Select(f => Convert(f)).ToList();

            var flightSearch = new FlightSearchDO
            {
                FromPlace = req.flyFrom,
                ToPlace = req.to,
                FromDate = req.dateFrom.ToDate(),
                ToDate = req.dateTo.ToDate(),
                Flights = converted
            };

            return flightSearch;
        }

        private FlightDO Convert(SPFlightSearchResult flight)
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

            var res = new FlightDO
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