using System.Linq;
using FlightsDataService;
using Gloobster.Common;

namespace Gloobster.SearchEngine.FlightsDataService
{
    public class TestCall
    {
        public void GetResults()
        {
            var caller = new Calls();

            var baseUrl = "https://api.skypicker.com/";
            var endpoint = "flights";
            
            var qb = new QueryBuilder();
            qb
            .BaseUrl(baseUrl)
            .Endpoint(endpoint)
            .Param("flyFrom", "PRG")
            .Param("to", "FRA")
            .Param("dateFrom", "01/06/2016")
            .Param("dateTo", "30/06/2016");

            var query = qb.Build();

            var result = caller.CallServer<SearchResultRoot>(query);

            var converted = result.data.Select(f => Convert(f)).ToList();

        }

        private Result Convert(FlightSearchResult flight)
        {
            var res = new Result
            {
                Price = flight.price,
                HoursLength = GetDuration(flight.fly_duration),
                Stops = flight.route.Count - 1
            };
            return res;
        }

        private double GetDuration(string time)
        {
            var prms = time.Split(' ');
            double res = double.Parse(prms[0].Replace("h", ""));
            double mins = double.Parse(prms[1].Replace("m", ""));

            res += (60/mins);
            return res;
        }


    }

    public class Result
    {
        public int Price;
        public int Stops;
        public double HoursLength;
    }
}

