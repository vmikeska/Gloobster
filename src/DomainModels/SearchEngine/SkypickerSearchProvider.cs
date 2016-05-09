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

        public List<FlightDO> Search(FlightQueryDO query)
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
                ;

            var qe = qb.Build();

            var result = caller.CallServer<SearchResultRoot>(qe);

            var converted = result.data.Select(f => Convert(f)).ToList();
            return converted;
        }

        private FlightDO Convert(FlightSearchResult flight)
        {
            var res = new FlightDO
            {
                Price = flight.price,
                HoursDuration = GetDuration(flight.fly_duration),
                Stops = flight.route.Count - 1
            };
            return res;
        }

        private decimal GetDuration(string time)
        {
            var prms = time.Split(' ');
            decimal res = decimal.Parse(prms[0].Replace("h", ""));
            decimal mins = decimal.Parse(prms[1].Replace("m", ""));

            if (mins > 0)
            {
                res += (60/mins);
            }
            return res;
        }
        
    }
}