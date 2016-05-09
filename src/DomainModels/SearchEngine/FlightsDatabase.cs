using System.Collections.Generic;
using System.Linq;
using Gloobster.DomainInterfaces.SearchEngine;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Mappers;

namespace Gloobster.DomainModels.SearchEngine
{
    public class FlightsDatabase: IFlightsDatabase
    {
        public IFlightsCache Cache { get; set; }


        private List<IFlightSearchProvider> Providers = new List<IFlightSearchProvider>
        {
            new SkypickerSearchProvider()
        };

        public List<FlightDO> GetFlights(FlightQueryDO query)
        {
            var cachedFlights = Cache.GetQuery(query);

            bool hasCachedResult = cachedFlights != null;

            if (hasCachedResult)
            {                
                return cachedFlights;
            }

            var newFlights = new List<FlightDO>();
            foreach (var provider in Providers)
            {
                List<FlightDO> flights = provider.Search(query);
                newFlights.AddRange(flights);
            }

            Cache.CacheQuery(query, newFlights);

            return newFlights;
        }

    }
}