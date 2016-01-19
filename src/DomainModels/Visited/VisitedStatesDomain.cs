using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Mappers;
using MongoDB.Bson;

namespace Gloobster.DomainModels
{    
    public class VisitedStatesDomain : IVisitedStatesDomain
    {
        public IDbOperations DB { get; set; }
        public IVisitedAggregationDomain AggDomain { get; set; }

        public async Task<List<VisitedStateDO>> AddNewStatesAsync(List<VisitedStateDO> inputStates, string userId)
        {
            var userIdObj = new ObjectId(userId);
            var visited = DB.C<VisitedEntity>().FirstOrDefault(v => v.PortalUser_id == userIdObj);

            var savedStates = visited.States;
            var savedCountriesCodes = savedStates.Select(c => c.StateCode).ToList();

            var newStates = new List<VisitedStateSE>();
            foreach (var state in inputStates)
            {
                bool alreadySaved = savedCountriesCodes.Contains(state.StateCode);
                if (!alreadySaved)
                {
                    var newState = new VisitedStateSE
                    {
                        id = ObjectId.GenerateNewId(),
                        StateCode = state.StateCode,
                        Dates = state.Dates
                    };
                    newStates.Add(newState);
                }
            }
            await PushStates(userIdObj, newStates);
            foreach (var state in newStates)
            {
                await AggDomain.AddState(state.StateCode, userId);
            }

            var newStatesResult = newStates.Select(c => c.ToDO()).ToList();
            return newStatesResult;
        }

        private async Task<bool> PushStates(ObjectId userIdObj, List<VisitedStateSE> value)
        {
            var filter = DB.F<VisitedEntity>().Eq(v => v.PortalUser_id, userIdObj);
            var update = DB.U<VisitedEntity>().PushEach(v => v.States, value);

            var res = await DB.UpdateAsync(filter, update);
            return res.ModifiedCount == 1;
        }
        
        public List<VisitedStateDO> GetStatesByUsers(List<string> ids, string meId)
        {
            bool isMe = ids.Count == 1 && ids[0] == meId;

            var idsObj = ids.Select(i => new ObjectId(i));
            var visiteds = DB.C<VisitedEntity>().Where(v => idsObj.Contains(v.PortalUser_id)).ToList();

            var visitedStates = visiteds.SelectMany(v => v.States);

            var vcGrouped = visitedStates.GroupBy(g => g.StateCode).ToList();
            var vcList = vcGrouped.Select(g =>
            {
                var outState = g.First().ToDO();
                outState.PortalUserId = null;
                outState.Count = g.Count();

                if (isMe)
                {
                    outState.Dates = g.Where(d => d.Dates != null).SelectMany(d => d.Dates).ToList();
                }

                return outState;
            });

            return vcList.ToList();
        }

        public List<VisitedStateDO> GetStatesOverall()
        {
            var statesAgg = DB.C<VisitedStatesAggregatedEntity>().ToList();
            var cs = statesAgg.Select(state => new VisitedStateDO
            {
                StateCode = state.StateCode,
                Dates = new List<DateTime>(),
                Count = state.Visitors.Count
            }).ToList();
            return cs;
        }
    }
}