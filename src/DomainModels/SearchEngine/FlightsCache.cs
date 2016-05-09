using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces.SearchEngine;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Entities.SearchEngine;
using MongoDB.Bson;
using Gloobster.Mappers;

namespace Gloobster.DomainModels.SearchEngine
{
    public class FlightsCache : IFlightsCache
    {
        public IDbOperations DB { get; set; }

        public async void CacheQuery(FlightQueryDO query, List<FlightDO> flights)
        {
            List<FlightSE> fs = flights.Select(f => f.ToEntity()).ToList();

            var cacheRecord = new FlightQueryEntity
            {
                id = ObjectId.GenerateNewId(),
                FromDate = query.FromDate,
                ToDate = query.ToDate,
                FromPlace = query.FromPlace,
                ToPlace = query.ToPlace,
                Flights = fs
            };

            
            await DB.SaveAsync(cacheRecord);
        }

        public List<FlightDO> GetQuery(FlightQueryDO query)
        {
            var r = DB.FOD<FlightQueryEntity>(q => q.FromPlace == query.FromPlace && q.ToPlace == query.ToPlace

            && q.FromDate.Year == query.FromDate.Year && q.FromDate.Month == query.FromDate.Month && q.FromDate.Day == query.FromDate.Day
            && q.ToDate.Year == query.ToDate.Year && q.ToDate.Month == query.ToDate.Month && q.ToDate.Day == query.ToDate.Day
            );

            if (r == null)
            {
                return null;
            }

            var flights = r.Flights.Select(f => f.ToDO()).ToList();
            return flights;
        }
    }
}
