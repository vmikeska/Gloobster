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
	public class VisitedPlacesDomain: IVisitedPlacesDomain
	{
		public IDbOperations DB { get; set; }

		public async Task<List<VisitedPlaceDO>> AddNewPlaces(List<VisitedPlaceDO> inputPlaces, string userId)
	    {		
			var query = $@"{{""PortalUser_id"": ObjectId(""{userId}"")}}";
			var alreadySavedPlaces = await DB.FindAsync<VisitedPlaceEntity>(query);
			
			var newPlaces = new List<VisitedPlaceEntity>();
			foreach (VisitedPlaceDO place in inputPlaces)
		    {
				bool isNewPlace =
					!alreadySavedPlaces.Any(p => p.City.Equals(place.City) && p.CountryCode.Equals(place.CountryCode));

			    if (isNewPlace)
			    {
				    var newPlaceEntity = place.ToEntity();
					newPlaceEntity.PortalUser_id = new ObjectId(userId);
					newPlaceEntity.id = ObjectId.GenerateNewId();
					newPlaces.Add(newPlaceEntity);
			    }
		    }

			if (newPlaces.Any())
			{
				await DB.SaveManyAsync(newPlaces);
			}

			var newPlacesDO = newPlaces.Select(e => e.ToDO()).ToList();
			return newPlacesDO;			
	    }

		public async Task<List<VisitedPlaceDO>> GetPlacesByUserId(string userId)
		{
			var query = $@"{{""PortalUser_id"": ObjectId(""{userId}"")}}";
			var places = await DB.FindAsync<VisitedPlaceEntity>(query);

			var placesDO = places.Select(p => p.ToDO()).ToList();
			return placesDO;
		}
	}




}
