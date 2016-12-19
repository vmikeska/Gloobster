using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Entities.Planning;
using Gloobster.Entities.Trip;
using Gloobster.Mappers;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Gloobster.DomainModels
{
    public class CustomSearchDomain: ICustomSearchDomain
    {
        public IDbOperations DB { get; set; }



        public async void CreateDbStructure(string userId)
        {
            var userIdObj = new ObjectId(userId);

            var custom = DB.FOD<PlanningCustomEntity>(e => e.User_id == userIdObj);
            if (custom == null)
            {                
                var search1 = BuildEmptySearch("My first search");
                
                custom = new PlanningCustomEntity
                {
                    id = ObjectId.GenerateNewId(),
                    User_id = userIdObj,
                    Searches = new List<CustomSearchSE> { search1 }
                };

                await DB.SaveAsync(custom);
            }
        }

        private CustomSearchSE BuildEmptySearch(string name)
        {
            var fromDate = DateTime.Now.AddDays(2);
            Date depDate = fromDate.ToDate();
            Date arrDate = fromDate.AddMonths(2).ToDate();

            var search1 = new CustomSearchSE
            {
                id = ObjectId.GenerateNewId(),
                Name = name,
                Deparature = depDate,
                Arrival = arrDate,
                CCs = new List<string>(),
                GIDs = new List<int>(),
                CustomAirs = new List<FromAirSE>(),
                DaysFrom = 5,
                DaysTo = 10,
                StandardAirs = true,
                Freq = 30,
                Started = false
            };

            return search1;
        }
        
        public async Task<CustomSearchDO> CreateNewSearch(string userId)
        {
            var name = "New search";

            var userIdObj = new ObjectId(userId);

            var search = BuildEmptySearch(name);

            var f = DB.F<PlanningCustomEntity>().Eq(p => p.User_id, userIdObj);
            var u = DB.U<PlanningCustomEntity>().Push(p => p.Searches, search);
            var updateRes = await DB.UpdateAsync(f, u);

            CustomSearchDO searchDO = search.ToDO();

            return searchDO;
        }

        public async Task<bool> DeleteSearch(string userId, string searchId)
        {
            var uid = new ObjectId(userId);
            var sid = new ObjectId(searchId);

            var filter = DB.F<PlanningCustomEntity>().Eq(f => f.User_id, uid);
            var update = DB.PF<PlanningCustomEntity, CustomSearchSE>(t => t.Searches, c => c.id == sid);
            var result = await DB.UpdateAsync(filter, update);
            return result.ModifiedCount == 1;
        }




        public async Task<bool> UpdateStarted(string userId, string searchId, bool started)
        {
            bool success = await UpdateCustomProperty(userId, searchId, "Started", started);
            return success;
        }

        public async Task<bool> UpdateName(string userId, string searchId, string name)
        {
            bool success = await UpdateCustomProperty(userId, searchId, "Name", name);
            return success;
        }

        public async Task<bool> UpdateStandardAir(string userId, string searchId, bool value)
        {
            bool success = await UpdateCustomProperty(userId, searchId, "StandardAirs", value);
            return success;
        }

        public async Task<bool> UpdateDaysRange(string userId, string searchId, int from, int to)
        {            
            bool s1 = await UpdateCustomProperty(userId, searchId, "DaysFrom", from);            
            bool s2 = await UpdateCustomProperty(userId, searchId, "DaysTo", to);

            return s1 && s2;
        }
        
        public async Task<bool> AddCustomAir(string userId, string searchId, string text, int origId)
        {
            var airSE = new FromAirSE
            {
                Text = text,
                OrigId = origId
            };

            bool success = await PushCustomProperty(userId, searchId, "CustomAirs", airSE);
            return success;
        }

        public async Task<bool> RemoveCustomAir(string userId, string searchId, int origId)
        {
            //maybe one day better
            var uid = new ObjectId(userId);
            var sid = new ObjectId(searchId);

            var customEntity = DB.FOD<PlanningCustomEntity>(u => u.User_id == uid);
            var search = customEntity.Searches.FirstOrDefault(s => s.id == sid);

            var airs = search.CustomAirs.Where(a => a.OrigId != origId);

            bool success = await UpdateCustomProperty(userId, searchId, "CustomAirs", airs);
            return success;
        }

        public async Task<bool> UpdateDeparature(string userId, string searchId, Date dep)
        {
            bool success = await UpdateCustomProperty(userId, searchId, "Deparature", dep);
            return success;
        }

        public async Task<bool> UpdateArrival(string userId, string searchId, Date arr)
        {
            bool success = await UpdateCustomProperty(userId, searchId, "Arrival", arr);
            return success;         
        }

        public async Task<bool> UpdateFreq(string userId, string searchId, int days)
        {
            bool success = await UpdateCustomProperty(userId, searchId, "Freq", days);
            return success;
        }

        
        private async Task<bool> PushCustomProperty(string userId, string searchId, string propName, object value)
        {
            var userIdObj = new ObjectId(userId);
            var searchIdObj = new ObjectId(searchId);
            var filter = DB.F<PlanningCustomEntity>().Eq(p => p.User_id, userIdObj)
                         & DB.F<PlanningCustomEntity>().Eq("Searches._id", searchIdObj);
            var update = DB.U<PlanningCustomEntity>().Push("Searches.$." + propName, value);
            var res = await DB.UpdateAsync(filter, update);
            return res.ModifiedCount == 1;
        }

        private async Task<bool> UpdateCustomProperty(string userId, string searchId, string propName, object value)
        {
            var userIdObj = new ObjectId(userId);
            var searchIdObj = new ObjectId(searchId);
            var filter = DB.F<PlanningCustomEntity>().Eq(p => p.User_id, userIdObj)
                         & DB.F<PlanningCustomEntity>().Eq("Searches._id", searchIdObj);
            var update = DB.U<PlanningCustomEntity>().Set("Searches.$." + propName, value);
            var res = await DB.UpdateAsync(filter, update);
            return res.ModifiedCount == 1;
        }
    }
}