using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.DomainModels
{
    public class VisitedAggregationDomain : IVisitedAggregationDomain
    {
        public IDbOperations DB { get; set; }
        public IGeoNamesService GNS { get; set; }
        
        public async Task<bool> AddCountry(string countryCode, string userId)
        {                        
            bool exists = DB.C<VisitedCountryAggregatedEntity>().Any(c => c.CountryCode == countryCode);
            if (exists)
            {                
                var filter = DB.F<VisitedCountryAggregatedEntity>().Eq(c => c.CountryCode, countryCode);
                var update = DB.U<VisitedCountryAggregatedEntity>().Push(c => c.Visitors, userId);

                var res = await DB.UpdateAsync(filter, update);
                return res.ModifiedCount == 1;
            }

            var country = new VisitedCountryAggregatedEntity
            {
                id = ObjectId.GenerateNewId(),
                CountryCode = countryCode,
                Visitors = new List<string> {userId}
            };
            await DB.SaveAsync(country);
            return true;
        }

        public async Task<bool> AddState(string stateCode, string userId)
        {
            bool exists = DB.C<VisitedStatesAggregatedEntity>().Any(c => c.StateCode == stateCode);
            if (exists)
            {
                var filter = DB.F<VisitedStatesAggregatedEntity>().Eq(c => c.StateCode, stateCode);
                var update = DB.U<VisitedStatesAggregatedEntity>().Push(c => c.Visitors, userId);

                var res = await DB.UpdateAsync(filter, update);
                return res.ModifiedCount == 1;
            }

            var state = new VisitedStatesAggregatedEntity
            {
                id = ObjectId.GenerateNewId(),
                StateCode = stateCode,                
                Visitors = new List<string> { userId }
            };
            await DB.SaveAsync(state);
            return true;
        }

        public async Task<bool> AddCity(int gid, string userId)
        {
            bool exists = DB.C<VisitedCityAggregatedEntity>().Any(c => c.GID == gid);
            if (exists)
            {
                var filter = DB.F<VisitedCityAggregatedEntity>().Eq(c => c.GID, gid);
                var update = DB.U<VisitedCityAggregatedEntity>().Push(c => c.Visitors, userId);

                var res = await DB.UpdateAsync(filter, update);
                return res.ModifiedCount == 1;
            }

            var city = await GNS.GetCityByIdAsync(gid);

            var newEnt = new VisitedCityAggregatedEntity
            {
                id = ObjectId.GenerateNewId(),
                City = city.Name,
                Location = city.Coordinates,
                CountryCode = city.CountryCode,
                GID = city.GID,                
                Visitors = new List<string> { userId }
            };
            await DB.SaveAsync(newEnt);
            return true;
        }

        public async Task<bool> AddPlace(SourceType sourceType, string sourceId, LatLng coord, string userId)
        {
            int sti = (int) sourceType;
            bool exists = DB.C<VisitedPlaceAggregatedEntity>().Any(c => c.SourceType == sti && c.SourceId == sourceId);            
            if (exists)
            {
                var filter = DB.F<VisitedPlaceAggregatedEntity>().Eq(c => c.SourceType, sti) & DB.F<VisitedPlaceAggregatedEntity>().Eq(c => c.SourceId, sourceId);
                var update = DB.U<VisitedPlaceAggregatedEntity>().Push(c => c.Visitors, userId);

                var res = await DB.UpdateAsync(filter, update);
                return res.ModifiedCount == 1;
            }
            
            var place = new VisitedPlaceAggregatedEntity
            {                
                id = ObjectId.GenerateNewId(),
                Location = coord,
                SourceType = (int)sourceType,
                SourceId = sourceId,
                
                Visitors = new List<string> { userId }
            };
            await DB.SaveAsync(place);
            return true;
        }
    }
}