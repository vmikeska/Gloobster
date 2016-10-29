using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainInterfaces.SearchEngine;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Entities.SearchEngine;
using Gloobster.Enums.SearchEngine;
using Gloobster.Mappers;
using MongoDB.Bson;

namespace Gloobster.DomainModels.SearchEngine
{
    public class FlightsDatabase :IFlightsDatabase
    {
        public IDbOperations DB { get; set; }
        public ISkypickerSearchProvider SpProvider { get; set; }
        public IFlightScoreEngine ScoreEngine { get; set; }
        
        public IComponentContext ComponentContext { get; set; }
        public IQueriesDriver RequestsDriver;
        
        public SearchResultDO GetQueryResults(FlightDbQueryDO query)
        {
            InitDriver(query.TimeType);

            var result = new SearchResultDO
            {
                From = query.FromPlace,
                To = query.MapId,
                Type = query.ToType                
            };

            var r = DB.FOD<SkypickerQueryEntity>(q =>
                q.FromPlace == query.FromPlace
                && q.ToPlace == query.Id
                && q.ToPlaceType == query.ToType
                && q.TimeType == query.TimeType
                );
        
            bool doesntExistAtAll = (r == null);
            if (doesntExistAtAll)
            {
                StartQueryForFirstTime(query);
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
                result.Result = RequestsDriver.GetResultsOfFinishedQuery(r.FoundConnectionsBetweenAirports);
                return result;
            }

            //will not happen
            return null;
        }

        //requerying is not implemented yet, should be called periodically from a service
        public void Requery(string queryId)
        {
            var queryIdObj = new ObjectId(queryId);
            var entity = DB.FOD<SkypickerQueryEntity>(e => e.id == queryIdObj);

            StartQuery(entity);
        }

        private void InitDriver(TimeType timeType)
        {
            var key = "";

            if (timeType == TimeType.Anytime)
            {
                key = "Anytime";
            }

            if (timeType == TimeType.Weekend)
            {
                key = "Weekend";
            }

            RequestsDriver = ComponentContext.ResolveKeyed<IQueriesDriver>(key);
        }

        private async void StartQueryForFirstTime(FlightDbQueryDO query)
        {
            var entity = new SkypickerQueryEntity
            {
                id = ObjectId.GenerateNewId(),
                FromPlace = query.FromPlace,
                ToPlace = query.Id,
                ToPlaceMap = query.MapId,
                ToPlaceType = query.ToType,
                FirstSearchStarted = true,
                FirstSearchFinished = false,
                FoundConnectionsBetweenAirports = new List<FromToSE>(),
                TimeType = query.TimeType,
                LastRequery = DateTime.UtcNow
            };
            await DB.SaveAsync(entity);

            StartQuery(entity);
        }
        
        private async void StartQuery(SkypickerQueryEntity entity)
        {
            List<FlightRequestDO> requests = RequestsDriver.BuildRequests(entity.FromPlace, entity.ToPlace, entity.ToPlaceType);

            var weekSearches = new List<FlightSearchDO>();
            
            //one request here is for one time period, week or weekend. Right now, possibly must not be like that in future
            foreach (FlightRequestDO request in requests)
            {
                FlightSearchDO searchResult = SpProvider.Search(request);
                if (searchResult == null)
                {
                    continue;
                }

                searchResult.Params = request.Params;
                weekSearches.Add(searchResult);
            }

            //this didn't work very well, but I should check on it again

            //Parallel.ForEach(requests, (request) =>
            //{
            //    FlightSearchDO weekSearch = SpProvider.Search(request);
            //    weekSearch.Params = request.Params;
            //    weekSearches.Add(weekSearch);               
            //});


            //we are requerying, therefore all old connections gonna be deleted
            bool isRequery = entity.FoundConnectionsBetweenAirports.Any();
            if (isRequery)
            {
                foreach (var conn in entity.FoundConnectionsBetweenAirports)
                {
                    await RequestsDriver.DeleteConnection(conn.From, conn.To);
                }                
            }

            ScoredFlights processedFlightsResult = await RequestsDriver.ProcessSearchResults(entity.ToPlaceMap, weekSearches);

            //taking just these flight which alived score evaluation
            await UpdateConnectionsBetweenAirports(processedFlightsResult.Passed, entity.id);

            //currently have no meaning, will be for future use
            var allFlights = processedFlightsResult.Passed;
            allFlights.AddRange(processedFlightsResult.Discarded);            
            ExtractSingleFlights(allFlights);
            
            await SetQueryWasFinishedForTheFirstTime(entity.id);
        }

        private async Task SetQueryWasFinishedForTheFirstTime(ObjectId id)
        {
            var filter = DB.F<SkypickerQueryEntity>().Eq(f => f.id, id);
            var update = DB.U<SkypickerQueryEntity>().Set(f => f.FirstSearchFinished, true);
            await DB.UpdateAsync(filter, update);
        }

        private async Task UpdateConnectionsBetweenAirports(List<FlightDO> passedFlights, ObjectId entityId)
        {
            var filter = DB.F<SkypickerQueryEntity>().Eq(f => f.id, entityId);

            var fromTos = passedFlights.Select(fl => new { fl.From, fl.To });
            var fromTosDist = fromTos.Distinct();
            var fromTosDistList = fromTosDist.Select(i => new FromToSE { From = i.From, To = i.To }).ToList();
            
            var u1 = DB.U<SkypickerQueryEntity>().Set(f => f.FoundConnectionsBetweenAirports, fromTosDistList);

            await DB.UpdateAsync(filter, u1);
        }
        
        //todo: extract single flights
        private async void ExtractSingleFlights(List<FlightDO> flights)
        {
            //var allSingleFlights = search.Flights.SelectMany(f => f.FlightParts).ToList();
            //foreach (var flight in allSingleFlights)
            //{
            //    //group and save to appropriate entities
            //}
        }

        
    }
}