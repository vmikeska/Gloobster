using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Entities;
using MongoDB.Bson;
using Nito.AsyncEx;

namespace Gloobster.DomainModels.SearchEngine8.Executing
{
    public class QueriesExecutor: IQueriesExecutor
    {
        public IDbOperations DB { get; set; }
        public IKiwiResultsExecutor KiwiExecutor { get; set; }
        public IKiwiResultsProcessor ResultsProcessor { get; set; }

        //todo: maybe execute just queries started by user ?

        private static readonly AsyncLock Lock = new AsyncLock();

        public async void ExecuteQueriesAsync()
        {
            var queries = new List<QueryEntity>();

            using (await Lock.LockAsync())
            {
                //implement just only X threads execution ?
                queries = DB.C<QueryEntity>().Where(s => s.State == QueryState8.Saved).OrderBy(a => a.Created).ToList();

                if (!queries.Any())
                {
                    return;
                }

                var ids = queries.Select(q => q.id);
                foreach (var id in ids)
                {
                    await UpdateQueryStateAsync(id, QueryState8.Started);
                }                
            }
            
            //just for test, remove
            var queries2 = DB.C<QueryEntity>().Where(s => s.State == QueryState8.Saved).OrderBy(a => a.Created).ToList();

            foreach (var query in queries)
            {                
                ExecuteQueryAsync(query);
            }

            Thread.Sleep(1000);

            ExecuteQueriesAsync();
        }

        public async Task DeleteOldQueriesAsync()
        {
            DateTime old = DateTime.UtcNow.AddHours(-1);

            await DB.DeleteAsync<QueryEntity>(q => q.State == QueryState8.Finished && q.Executed.Value < old);
        }
        
        private async Task ExecuteQueryAsync(QueryEntity query)
        {
            try
            {                
                IQueryBuilder builder = GetBuilder(query);
                FlightRequestDO request = BuildRequest(query, builder);
                List<FlightDO> flights = KiwiExecutor.Search(request);

                await ResultsProcessor.ProcessFlightsAsync(flights, query.TimeType, query.id.ToString(), query.Params);

                await UpdateQueryExcecutedAsync(query.id);
                await UpdateQueryStateAsync(query.id, QueryState8.Finished);
            }
            catch (Exception exc)
            {
                await UpdateQueryStateAsync(query.id, QueryState8.Failed);
            }
            
        }

        private async Task UpdateQueryExcecutedAsync(ObjectId id)
        {
            var filter = DB.F<QueryEntity>().Eq(f => f.id, id);
            var update = DB.U<QueryEntity>().Set(u => u.Executed, DateTime.UtcNow);

            await DB.UpdateAsync(filter, update);
        }

        private async Task UpdateQueryStateAsync(ObjectId id, QueryState8 state)
        {
            var filter = DB.F<QueryEntity>().Eq(f => f.id, id);
            var update = DB.U<QueryEntity>().Set(u => u.State, state);

            await DB.UpdateAsync(filter, update);
        }

        private FlightRequestDO BuildRequest(QueryEntity query, IQueryBuilder builder)
        {
            FlightRequestDO request = null;

            if (query.ToType == PlaceType8.City)
            {
                int gid = int.Parse(query.To);
                request = builder.BuildCity(query.FromAir, gid);
            }

            if (query.ToType == PlaceType8.Country)
            {
                request = builder.BuildCountry(query.FromAir, query.To);
            }

            return request;
        }

        private IQueryBuilder GetBuilder(QueryEntity query)
        {
            IQueryBuilder builder = null;

            if (query.TimeType == TimeType8.Anytime)
            {
                builder = new AnytimeKiwiQueryBuilder();
            }

            if (query.TimeType == TimeType8.Weekend)
            {
                var prms = ParamsParsers.Weekend(query.Params);                
                builder = new WeekendKiwiQueryBuilder(prms.Week, prms.Year);
            }

            if (query.TimeType == TimeType8.Custom)
            {
                var prms = ParamsParsers.Custom(query.Params);
                builder = new CustomKiwiQueryBuilder(prms.UserId, prms.SearchId);
            }

            return builder;
        }
    }
}