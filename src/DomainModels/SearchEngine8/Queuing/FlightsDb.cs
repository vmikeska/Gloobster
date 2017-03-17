using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces.SearchEngine8;
using Gloobster.DomainObjects.SearchEngine8;
using Gloobster.Entities.SearchEngine;
using Gloobster.Enums.SearchEngine;
using MongoDB.Bson;
using Gloobster.Mappers.SearchEngine8;
using MongoDB.Driver;
using Serilog;

namespace Gloobster.DomainModels.SearchEngine8.Queuing
{
    public class FlightsDb: IFlightsDb
    {
        private const int MaxCacheLifeTimeMins = 60;

        public IDbOperations DB { get; set; }
        public IQueriesExecutor QueriesExecutor { get; set; }
        public ILogger Log { get; set; }

        public async Task<FlightQueryResult8DO<T>> GetResultsAsync<T>(FlightQuery8DO q)
        {
            try
            {
                QueryEntity queryEntity = GetQuery(q);

                bool queryExists = queryEntity != null;
                if (queryExists)
                {
                    var qid = queryEntity.id.ToString();

                    if (queryEntity.State == QueryState.Saved)
                    {
                        return BuildResultBase<T>(q, qid, QueryState.Saved);
                    }

                    if (queryEntity.State == QueryState.Started)
                    {
                        return BuildResultBase<T>(q, qid, QueryState.Started);
                    }

                    if (queryEntity.State == QueryState.Failed)
                    {
                        if (queryEntity.Restarted > 0)
                        {
                            return BuildResultBase<T>(q, qid, QueryState.Failed);
                        }

                        queryEntity.Restarted = 1;
                        queryEntity.State = QueryState.Saved;

                        await DB.ReplaceOneAsync(queryEntity);
                        return BuildResultBase<T>(q, qid, QueryState.Saved);
                    }

                    if (queryEntity.State == QueryState.Finished)
                    {
                        bool isOld = true;
                        if (queryEntity.Executed.HasValue)
                        {
                            TimeSpan age = DateTime.UtcNow - queryEntity.Executed.Value;
                            isOld = age.TotalMinutes > MaxCacheLifeTimeMins;
                        }

                        if (isOld)
                        {
                            await DeleteQueryAsync(queryEntity);
                        }
                        else
                        {
                            var finishedResult = BuildResultBase<T>(q, qid, QueryState.Finished);
                            var results = GetResults<T>(queryEntity.id);
                            finishedResult.Results = results;
                            return finishedResult;
                        }
                    }
                }

                var newQueryId = await SaveQueryAsync(q);
                QueriesExecutor.ExecuteQueriesAsync();
                return BuildResultBase<T>(q, newQueryId, QueryState.Saved);
            }
            catch (Exception exc)
            {
                Log.Error($"FlightsFnc, GetResultsAsync: {exc.Message}");
                throw;
            }
        }

        public List<FlightQueryResult8DO<T>> CheckOnResults<T>(List<string> ids)
        {
            try
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

                    if (query.State == QueryState.Finished)
                    {
                        result.Results = GetResults<T>(query.id);
                    }


                    if (query.State == QueryState.Started)
                    {
                        var executedAgo = DateTime.UtcNow - query.Created;
                        bool isOld = executedAgo.TotalSeconds > 60;

                        if (isOld)
                        {
                            RestartQueryAsync(query);
                        }
                    }

                    results.Add(result);
                }

                return results;
            }
            catch (Exception exc)
            {
                Log.Error($"FlightsFnc, CheckOnResults: {exc.Message}");
                throw;
            }
        }


        private FlightQueryResult8DO<T> BuildResultBase<T>(FlightQuery8DO query, string qid, QueryState state)
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

        private async Task DeleteQueryAsync(QueryEntity queryEntity)
        {
            await DB.DeleteAsync<QueryEntity>(queryEntity.id);

            if (queryEntity.TimeType == TimeType.Anytime)
            {
                await DB.DeleteAsync<AnytimeResultsEntity>(q => q.Query_id == queryEntity.id);
            }

            if (queryEntity.TimeType == TimeType.Weekend)
            {
                await DB.DeleteAsync<WeekendResultsEntity>(q => q.Query_id == queryEntity.id);
            }

            if (queryEntity.TimeType == TimeType.Custom)
            {
                await DB.DeleteAsync<CustomResultsEntity>(q => q.Query_id == queryEntity.id);
            }            
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
                State = QueryState.Saved,
                Created = DateTime.UtcNow,
                Executed = null
            };

            await DB.SaveAsync(ent);

            return id.ToString();
        }

        private async Task RestartQueryAsync(QueryEntity q)
        {            
            q.State = QueryState.Saved;
            q.Created = DateTime.UtcNow;

            await DB.ReplaceOneAsync(q);
        }
    }
}