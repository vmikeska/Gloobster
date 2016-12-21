using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces.SearchEngine8;
using Gloobster.DomainObjects.SearchEngine8;
using Gloobster.Entities.SearchEngine;
using Gloobster.Enums.SearchEngine;
using MongoDB.Bson;

namespace Gloobster.DomainModels.SearchEngine8.Queuing
{
    public class ClientRequestExecutor: IClientRequestExecutor
    {
        public IDbOperations DB { get; set; }
        public IRequestsBuilder8 ReqBuilder { get; set; }
        public IFlightsDb FlightsDB { get; set; }

        public async Task<List<FlightQueryResult8DO<T>>> ExeFirstRequestAsync<T>(string userId, TimeType timeType, string customId = null)
        {
            var userIdObj = new ObjectId(userId);
            
            var dests = GetDestinations(timeType, userIdObj, customId);
            var queries = GetQueries(timeType, dests, userId, customId);
            
            var results = await ExeQueriesAsync<T>(queries);
            return results;
        }

        public async Task<List<FlightQueryResult8DO<T>>> ExeSingleRequestsAsync<T>(string userId, TimeType timeType, DestinationRequests8DO dests, string customId = null)
        {
            var queries = GetQueries(timeType, dests, userId, customId);

            var results = await ExeQueriesAsync<T>(queries);
            return results;
        }

        public List<FlightQueryResult8DO<T>> ExeRequery<T>(List<string> ids)
        {
            var results = FlightsDB.CheckOnResults<T>(ids);
            return results;
        }


        private List<FlightQuery8DO> GetQueries(TimeType timeType, DestinationRequests8DO dests, string userId, string customId = null)
        {
            List<FlightQuery8DO> queries = null;

            if (timeType == TimeType.Anytime)
            {                 
                queries = ReqBuilder.BuildQueriesAnytime(dests, userId);
            }

            if (timeType == TimeType.Weekend)
            {                
                queries = ReqBuilder.BuildQueriesWeekend(dests, userId);
            }

            if (timeType == TimeType.Custom)
            {             
                queries = ReqBuilder.BuildQueriesCustom(dests, userId, customId);
            }

            return queries;
        }

        private DestinationRequests8DO GetDestinations(TimeType timeType, ObjectId userIdObj, string customId)
        {
            DestinationRequests8DO dests = null;

            if (timeType == TimeType.Anytime)
            {
                dests = GetDestinationsAnytime(userIdObj);                
            }

            if (timeType == TimeType.Weekend)
            {
                dests = GetDestinationsWeekend(userIdObj);                
            }

            if (timeType == TimeType.Custom)
            {
                var customObjId = new ObjectId(customId);
                dests = GetDestinationsCustom(userIdObj, customObjId);                
            }

            return dests;
        }

        private async Task<List<FlightQueryResult8DO<T>>> ExeQueriesAsync<T>(List<FlightQuery8DO> queries)
        {
            var results = new List<FlightQueryResult8DO<T>>();
            foreach (var query in queries)
            {
                var result = await FlightsDB.GetResultsAsync<T>(query);
                results.Add(result);
            }

            return results;
        }

        private DestinationRequests8DO GetDestinationsAnytime(ObjectId userIdObj)
        {
            var destinations = new DestinationRequests8DO();
            
            var ent = DB.FOD<DealsAnytimeEntity>(u => u.User_id == userIdObj);
            destinations.GIDs = ent.Cities;
            destinations.CCs = ent.CountryCodes;
            
            return destinations;
        }
        
        private DestinationRequests8DO GetDestinationsWeekend(ObjectId userIdObj)
        {
            var destinations = new DestinationRequests8DO();
            
            var ent = DB.FOD<DealsWeekendEntity>(u => u.User_id == userIdObj);
            destinations.GIDs = ent.Cities;
            destinations.CCs = ent.CountryCodes;
            
            return destinations;
        }

        private DestinationRequests8DO GetDestinationsCustom(ObjectId userIdObj, ObjectId customIdObj)
        {
            var destinations = new DestinationRequests8DO();

            var ent = DB.FOD<DealsCustomEntity>(u => u.User_id == userIdObj);
            var search = ent.Searches.FirstOrDefault(s => s.id == customIdObj);

            destinations.GIDs = search.GIDs;
            destinations.CCs = search.CCs;

            return destinations;
        }
    }
}
