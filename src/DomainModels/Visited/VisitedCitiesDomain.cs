using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Mappers;
using MongoDB.Bson;

namespace Gloobster.DomainModels
{
    public class VisitedCitiesDomain: IVisitedCitiesDomain
	{
		public IDbOperations DB { get; set; }
        public IVisitedAggregationDomain AggDomain { get; set; }
        public IGeoNamesService GeoNamesService { get; set; }
        public IEntitiesDemandor Demandor { get; set; }

        public async Task<List<VisitedCityDO>> AddNewCitiesByGIDAsync(List<GidDateDO> gids, string userId)
        {
            var userIdObj = new ObjectId(userId);
            var visited = await Demandor.GetVisitedAsync(userIdObj);
            List<int> visitedGids = visited.Cities.Select(g => g.GeoNamesId).ToList();

            var validGids = gids.Where(g => g.GID != 0).ToList();
            var newGids = validGids.Where(g => !visitedGids.Contains(g.GID)).ToList();

            var newCities = new List<VisitedCitySE>();
            foreach (var c in newGids)
            {                
                var newCity = new VisitedCitySE();
                var gnCity = await GeoNamesService.GetCityByIdAsync(c.GID);
                newCity.id = ObjectId.GenerateNewId();
                newCity.GeoNamesId = gnCity.GID;
                newCity.Location = gnCity.Coordinates;
                newCity.City = gnCity.Name;
                newCity.CountryCode = gnCity.CountryCode;
                newCity.UsState = gnCity.UsState;
                newCity.Dates = c.Dates.ToArray();
                
                newCities.Add(newCity);                
            }

            if (newCities.Any())
            {
                await PushCities(userIdObj, newCities);
                foreach (var city in newCities)
                {
                    await AggDomain.AddCity(city.GeoNamesId, userId);                    
                }
            }

            var newPlacesDO = newCities.Select(e => e.ToDO()).ToList();
            return newPlacesDO;
        }

        public async Task<List<VisitedCityDO>> AddNewCitiesWithGidAsync(List<VisitedCityDO> inputCities, string userId)
        {
            var userIdObj = new ObjectId(userId);
            var visited = await Demandor.GetVisitedAsync(userIdObj);

            var newCities = new List<VisitedCitySE>();
            foreach (VisitedCityDO city in inputCities)
            {
                bool isNewCity = !IsAlreadySavedCity(visited.Cities, city);
                if (isNewCity)
                {
                    var newCityEntity = city.ToEntity();
                    newCityEntity.id = ObjectId.GenerateNewId();

                    
                    var geoNamesCities = await GeoNamesService.GetCityAsync(city.City, city.CountryCode, 1);
                    if (geoNamesCities.Any())
                    {
                        var geoNamesCity = geoNamesCities.First();
                        newCityEntity.GeoNamesId = geoNamesCity.GID;
                        newCityEntity.Location = geoNamesCity.Coordinates;
                    }
                    

                    newCities.Add(newCityEntity);
                }
            }

            if (newCities.Any())
            {
                await PushCities(userIdObj, newCities);
                foreach (var city in newCities)
                {
                    if (city.GeoNamesId != 0)
                    {
                        await AggDomain.AddCity(city.GeoNamesId, userId);
                    }
                }
            }

            var newPlacesDO = newCities.Select(e => e.ToDO()).ToList();
            return newPlacesDO;
        }
        
        public List<VisitedCityDO> GetCitiesByUsers(List<string> ids, string meId)
        {
            bool isMe = ids.Count == 1 && ids[0] == meId;

            var idsObj = ids.Select( i => new ObjectId(i));
            var visiteds = DB.C<VisitedEntity>().Where(v => idsObj.Contains(v.User_id)).ToList();

            var cities = visiteds.SelectMany(c => c.Cities);
            
            var citiesWithGID = cities.Where(c => c.GeoNamesId != 0).ToList();

            var vcGrouped = citiesWithGID.GroupBy(g => g.GeoNamesId).ToList();
            var vcList = vcGrouped.Select(g =>
            {
                var outCity = g.First().ToDO();
                outCity.PortalUserId = null;
                outCity.Count = g.Count();

                if (isMe)
                {                    
                    outCity.Dates = g.Where(d => d.Dates != null).SelectMany(d => d.Dates).ToList();
                }
                
                return outCity;
            });

            return vcList.ToList();            
        }

        private async Task<bool> PushCities(ObjectId userIdObj, List<VisitedCitySE> value)
        {
            var filter = DB.F<VisitedEntity>().Eq(v => v.User_id, userIdObj);
            var update = DB.U<VisitedEntity>().PushEach(v => v.Cities, value);

            var res = await DB.UpdateAsync(filter, update);
            return res.ModifiedCount == 1;
        }

        private bool IsAlreadySavedCity(List<VisitedCitySE> visited, VisitedCityDO currentCity)
        {
            if (currentCity.GeoNamesId != 0)
            {
                bool exist = visited.Any(c => c.GeoNamesId == currentCity.GeoNamesId);
                return exist;
            }

            bool exist2 = visited.Any(p => (p.City == currentCity.City && p.CountryCode == currentCity.CountryCode));
            return exist2;
        }


        public List<VisitedCityDO> GetCitiesOverall()
        {
            var citiesAgg = DB.C<VisitedCityAggregatedEntity>().ToList();
            var cs = citiesAgg.Select(city => new VisitedCityDO
            {
                Count = city.Visitors.Count,
                CountryCode = city.CountryCode,
                City = city.City,
                Location = city.Location,
                Dates = new List<DateTime>(),
                GeoNamesId = city.GID                
            }).ToList();
            return cs;
        }



    }
}
