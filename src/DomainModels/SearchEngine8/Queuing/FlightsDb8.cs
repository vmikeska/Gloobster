using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using MongoDB.Bson;

namespace Gloobster.DomainModels.SearchEngine8.Queuing
{
    public class FlightsDb8: IFlightsDb8
    {
        private const int maxCacheLifeTimeMins = 60;

        public IDbOperations DB { get; set; }
        public IQueriesExecutor QueriesExecutor { get; set; }

        public async Task<FlightQueryResult8DO<T>> GetResultsAsync<T>(FlightQuery8DO q)
        {
            QueryEntity queryEntity = GetQuery(q);

            bool queryExists = queryEntity != null;
            if (queryExists)
            {
                var qid = queryEntity.id.ToString();

                if (queryEntity.State == QueryState8.Saved)
                {
                    return GetResultBase<T>(q, qid, QueryState8.Saved);
                }

                if (queryEntity.State == QueryState8.Started)
                {
                    return GetResultBase<T>(q, qid, QueryState8.Started);
                }

                if (queryEntity.State == QueryState8.Finished)
                {
                    TimeSpan age = DateTime.UtcNow - queryEntity.Executed.Value;
                    bool isOld = age.TotalMinutes > maxCacheLifeTimeMins;

                    if (isOld)
                    {
                        await DeleteQueryAsync(queryEntity.id);
                    }
                    else
                    {
                        var finishedResult = GetResultBase<T>(q, qid, QueryState8.Finished);
                        finishedResult.Results = GetResults<T>(queryEntity.id);
                        return finishedResult;
                    }                    
                }
            }
            
            var newQueryId = await SaveQueryAsync(q);
            QueriesExecutor.ExecuteQueriesAsync();
            return GetResultBase<T>(q, newQueryId, QueryState8.Saved);            
        }

        private FlightQueryResult8DO<T> GetResultBase<T>(FlightQuery8DO query, string qid, QueryState8 state)
        {            
            return new FlightQueryResult8DO<T>
            {
                QueryId = qid,
                State = state,

                From = query.FromAir,

                ToType = query.ToType,
                To = query.To,
                Prms = query.Params
            };
        }
        
        public List<FlightQueryResult8DO<T>> CheckOnResults<T>(List<string> ids)
        {
            var results = new List<FlightQueryResult8DO<T>>();

            var objIds = ids.Select(i => new ObjectId(i)).ToList();

            var queries = DB.List<QueryEntity>(e => objIds.Contains(e.id));

            foreach (QueryEntity query in queries)
            {
                var result = new FlightQueryResult8DO<T>
                {
                    QueryId = query.id.ToString(),
                    State = query.State,

                    From = query.FromAir,

                    ToType = query.ToType,
                    To = query.To,

                    Prms = query.Params
                };

                if (query.State == QueryState8.Finished)
                {
                    result.Results = GetResults<T>(query.id);                    
                }
                
                results.Add(result);               
            }

            return results;
        }

        private List<T> GetResults<T>(ObjectId qid)
        {
            if (typeof(T) == typeof(AnytimeResultDO))
            {
                var resultsEnts = DB.List<AnytimeResultsEntity>(i => i.Query_id == qid);
                var results = resultsEnts.Select(e => e.ToDO()).ToList();
                return results as List<T>;
            }

            if (typeof(T) == typeof(WeekendResultDO))
            {
                var resultsEnts = DB.List<WeekendResultsEntity>(i => i.Query_id == qid);
                var results = resultsEnts.Select(e => e.ToDO()).ToList();
                return results as List<T>;
            }

            if (typeof(T) == typeof(CustomResultDO))
            {
                var resultsEnts = DB.List<CustomResultsEntity>(i => i.Query_id == qid);
                var results = resultsEnts.Select(e => e.ToDO()).ToList();
                return results as List<T>;
            }
            
            return null;
        }

        private async Task DeleteQueryAsync(ObjectId id)
        {
            await DB.DeleteAsync<QueryEntity>(id);
            //todo: delete results
        }

        private QueryEntity GetQuery(FlightQuery8DO q)
        {
            var ent = DB.FOD<QueryEntity>(e =>
                e.FromAir == q.FromAir &&
                e.To == q.To &&
                e.ToType == q.ToType &&
                e.TimeType == q.TimeType &&
                e.Params == q.Params);
            
            return ent;
        }

        private async Task<string> SaveQueryAsync(FlightQuery8DO q)
        {
            var id = ObjectId.GenerateNewId();

            var ent = new QueryEntity
            {
                id = id,
                FromAir = q.FromAir,
                To = q.To,
                ToType = q.ToType,
                TimeType = q.TimeType,
                Params = q.Params,
                State = QueryState8.Saved,
                Created = DateTime.UtcNow,
                Executed = null
            };

            await DB.SaveAsync(ent);

            return id.ToString();
        }
    }
}