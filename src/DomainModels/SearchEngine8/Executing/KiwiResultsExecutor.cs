using System;
using System.Collections.Generic;
using System.Linq;
using Gloobster.Common;
using Gloobster.DomainInterfaces.SearchEngine8;
using Gloobster.DomainModels.SearchEngine;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.DomainObjects.SearchEngine8;
using Gloobster.DomainObjects;

namespace Gloobster.DomainModels.SearchEngine8.Executing
{
    public class KiwiResultsExecutor: IKiwiResultsExecutor
    {
        public const string BaseUrl = "https://api.skypicker.com/";
        public const string Endpoint = "flights";

        public List<FlightDO> Search(FlightRequestDO req)
        {
            var caller = new Calls();

            var qb = new QueryBuilder();
            qb
                .BaseUrl(BaseUrl)
                .Endpoint(Endpoint)

                .Param("partner", "picky")
                .Param("v", "2");


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
            
            return converted;
        }

        private FlightDO Convert(KiwiFlightSearchResult flight)
        {
            var flightParts = new List<FlightPartDO>();
            foreach (var route in flight.route)
            {
                var dTimeUtc = ConvertDate(route.dTimeUTC);
                var aTimeUtc = ConvertDate(route.aTimeUTC);
                TimeSpan duration = aTimeUtc - dTimeUtc;

                var flightPart = new FlightPartDO
                {
                    From = route.flyFrom,
                    To = route.flyTo,
                    DeparatureTime = ConvertDate(route.dTime),
                    ArrivalTime = ConvertDate(route.aTime),
                    Airline = route.airline,
                    MinsDuration = (int)duration.TotalMinutes,
                    FlightNo = route.flight_no
                };
                flightParts.Add(flightPart);
            }

            var bookLink = GetBookLink(flight.deep_link);
            
            var res = new FlightDO
            {
                Price = flight.price,
                HoursDuration = GetDuration(flight.fly_duration),
                Connections = flight.route.Count,
                From = flight.flyFrom,
                To = flight.flyTo,
                FlightParts = flightParts,
                BookLink = bookLink
            };
            return res;
        }

        private string GetBookLink(string deepLink)
        {
            var l = deepLink;
            l = l.Replace("picky", "gloobster");
            return l;
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
                res += (60 / mins);
            }
            return res;
        }
    }
}