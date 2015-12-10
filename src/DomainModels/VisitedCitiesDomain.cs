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

		public IGeoNamesService GeoNamesService { get; set; }

		public async Task<List<VisitedCityDO>> AddNewCitiesAsync(List<VisitedCityDO> inputCities, string userId)
	    {		
			var userIdObj = new ObjectId(userId);
			var alreadySavedCities = DB.C<VisitedCityEntity>().Where(c => c.PortalUser_id == userIdObj).ToList();				
			
			var newCities = new List<VisitedCityEntity>();
			foreach (VisitedCityDO city in inputCities)
			{
				bool isNewCity = !IsAlreadySavedCity(alreadySavedCities, city);
			    if (isNewCity)
			    {
					var newPlaceEntity = city.ToEntity();
					newPlaceEntity.PortalUser_id = new ObjectId(userId);
					newPlaceEntity.id = ObjectId.GenerateNewId();

				    if (city.GeoNamesId != 0)
				    {
					    var geoNameCity = await GeoNamesService.GetCityByIdAsync(city.GeoNamesId);
						newPlaceEntity.GeoNamesId = geoNameCity.GID;
						newPlaceEntity.Location = geoNameCity.Coordinates;
					    newPlaceEntity.City = geoNameCity.Name;
					    newPlaceEntity.CountryCode = geoNameCity.CountryCode;
				    }
				    else
				    {
						var geoNamesCities = await GeoNamesService.GetCityAsync(city.City, city.CountryCode, 1);
						if (geoNamesCities.Any())
						{
							var geoNamesCity = geoNamesCities.First();
							newPlaceEntity.GeoNamesId = geoNamesCity.GID;
							newPlaceEntity.Location = geoNamesCity.Coordinates;
						}
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

		private bool IsAlreadySavedCity(List<VisitedCityEntity> visited, VisitedCityDO currentCity)
		{
			if (currentCity.GeoNamesId != 0)
			{
				bool exist = visited.Any(c => c.GeoNamesId == currentCity.GeoNamesId);
				return exist;
			}
			
			bool exist2 = visited.Any(p => (p.City == currentCity.City && p.CountryCode == currentCity.CountryCode));
			return exist2;
		}

		public List<VisitedCityDO> GetCitiesByUserId(string userId)
		{
			var userIdObj = new ObjectId(userId);
			var cities = DB.C<VisitedCityEntity>().Where(c => c.PortalUser_id == userIdObj).ToList();

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
				outCity.Dates = g.Where(d => d.Dates != null).SelectMany(d => d.Dates).ToList();
				return outCity;
			});
			
			return vcList.ToList();
		}



	}
}
