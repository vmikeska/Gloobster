using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.Mappers;
using MongoDB.Bson;
using MongoDB.Driver.Linq;

namespace Gloobster.DomainModels
{
	public class VisitedPlacesDomain : IVisitedPlacesDomain
	{
		public IDbOperations DB { get; set; }

		public IFriendsDomain FriendsService { get; set; }

		public async Task<List<VisitedPlaceDO>> AddNewPlacesAsync(List<VisitedPlaceDO> inputPlaces, string userId)
		{
			var query = $@"{{""PortalUser_id"": ObjectId(""{userId}"")}}";
			var alreadySavedPlaces = await DB.FindAsync<VisitedPlaceEntity>(query);

			var newPlaces = new List<VisitedPlaceEntity>();
			foreach (var place in inputPlaces)
			{
				bool isNewPlace =
					!alreadySavedPlaces.Any(p => p.SourceId == place.SourceId && p.SourceType == (int)place.SourceType);

				if (isNewPlace)
				{
					var newPlaceEntity = place.ToEntity();
					newPlaceEntity.PortalUser_id =  new ObjectId(userId);
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

		public async Task<List<VisitedPlaceDO>> GetPlacesByUserIdAsync(string userId)
		{
			var query = $@"{{""PortalUser_id"": ObjectId(""{userId}"")}}";
			var places = await DB.FindAsync<VisitedPlaceEntity>(query);

			var placesDO = places.Select(p => p.ToDO()).ToList();
			return placesDO;
		}

		public List<VisitedPlaceDO> GetPlacesOfMyFriendsByUserId(string userId)
		{
			var userIdObj = new ObjectId(userId);
			var friends = DB.C<FriendsEntity>().FirstOrDefault(f => f.PortalUser_id == userIdObj);

			var friendsId = new List<ObjectId> { userIdObj };
			friendsId.AddRange(friends.Friends);

			var visitedPlaces = DB.C<VisitedPlaceEntity>().Where(p => friendsId.Contains(p.PortalUser_id)).ToList();
			var visitedPlacesDO = visitedPlaces.Select(p => p.ToDO()).ToList();

			return visitedPlacesDO;			
		}
	}

}