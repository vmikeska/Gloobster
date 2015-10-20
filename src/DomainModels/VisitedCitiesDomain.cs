using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.Mappers;
using MongoDB.Bson;

namespace Gloobster.DomainModels
{
	public class VisitedCitiesDomain: IVisitedCitiesDomain
	{
		public IDbOperations DB { get; set; }

		public IGeoNamesService GeoNamesService { get; set; }

		public async Task<List<VisitedCityDO>> AddNewCitiesAsync(List<VisitedCityDO> inputCities, string userId)
	    {		
			var query = $@"{{""PortalUser_id"": ObjectId(""{userId}"")}}";
			var alreadySavedCities = await DB.FindAsync<VisitedCityEntity>(query);
			
			var newCities = new List<VisitedCityEntity>();
			foreach (VisitedCityDO city in inputCities)
		    {
				bool isNewCity =
					!alreadySavedCities.Any(p => p.City == city.City && p.CountryCode == city.CountryCode);

			    if (isNewCity)
			    {
					var newPlaceEntity = city.ToEntity();
					newPlaceEntity.PortalUser_id = new ObjectId(userId);
					newPlaceEntity.id = ObjectId.GenerateNewId();

					var geoNamesCities = await GeoNamesService.GetCityAsync(city.City, city.CountryCode, 1);
					if (geoNamesCities.GeoNames.Any())
					{
						var geoNamesCity = geoNamesCities.GeoNames.First();
						newPlaceEntity.GeoNamesId = geoNamesCity.GeonameId;
						newPlaceEntity.Location = new LatLng { Lat = geoNamesCity.Latitude, Lng = geoNamesCity.Longitude };
					}
					
					newCities.Add(newPlaceEntity);
			    }
		    }

			if (newCities.Any())
			{
				await DB.SaveManyAsync(newCities);
			}

			var newPlacesDO = newCities.Select(e => e.ToDO()).ToList();
			return newPlacesDO;			
	    }
		
		public async Task<List<VisitedCityDO>> GetCitiesByUserIdAsync(string userId)
		{
			var query = $@"{{""PortalUser_id"": ObjectId(""{userId}"")}}";
			var cities = await DB.FindAsync<VisitedCityEntity>(query);

			var citiesDO = cities.Select(p => p.ToDO()).ToList();
			return citiesDO;
		}

		public List<VisitedCityDO> GetCitiesOfMyFriendsByUserId(string userId)
		{			
			var userIdObj = new ObjectId(userId);
			var friends = DB.C<FriendsEntity>().FirstOrDefault(f => f.PortalUser_id == userIdObj);

			var friendsId = new List<ObjectId> {userIdObj};
			friendsId.AddRange(friends.Friends);
			
			var visitedCities = DB.C<VisitedCityEntity>().Where(p => friendsId.Contains(p.PortalUser_id)).ToList();			
			//todo: group and add also this
			var vcWithoutGNId = visitedCities.Where(c => c.GeoNamesId == 0).ToList();

			var vcWithGNId = visitedCities.Where(c => c.GeoNamesId != 0).ToList();
			var vcGrouped = vcWithGNId.GroupBy(g => g.GeoNamesId).ToList();
			var vcList = vcGrouped.Select(g =>
			{
				var outCity = g.First().ToDO();
				outCity.PortalUserId = null;
				outCity.Dates = g.SelectMany(d => d.Dates).ToList();
				return outCity;
			});
			
			return vcList.ToList();
		}



	}
}
