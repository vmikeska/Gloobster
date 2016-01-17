using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Mappers;
using MongoDB.Bson;
using MongoDB.Driver.Linq;

namespace Gloobster.DomainModels
{
	public class VisitedPlacesDomain : IVisitedPlacesDomain
	{
		public IDbOperations DB { get; set; }
        public IVisitedAggregationDomain AggDomain { get; set; }
        public IFriendsDomain FriendsService { get; set; }

		public async Task<List<VisitedPlaceDO>> AddNewPlacesAsync(List<VisitedPlaceDO> inputPlaces, string userId)
		{
			var userIdObj = new ObjectId(userId);			
			var visited = DB.C<VisitedEntity>().FirstOrDefault(p => p.PortalUser_id == userIdObj);

			var newPlaces = new List<VisitedPlaceSE>();
			foreach (var place in inputPlaces)
			{
				bool isNewPlace = !visited.Places.Any(p => p.SourceId == place.SourceId && p.SourceType == (int)place.SourceType);
				if (isNewPlace)
				{
					var newPlaceEntity = place.ToEntity();					
					newPlaceEntity.id = ObjectId.GenerateNewId();
					newPlaces.Add(newPlaceEntity);
				}
			}

			if (newPlaces.Any())
			{
				await PushPlaces(userIdObj, newPlaces);
			    foreach (var place in newPlaces)
			    {
                    await AggDomain.AddPlace((SourceType)place.SourceType, place.SourceId, place.Location, userId);
                }
			}

			var newPlacesDO = newPlaces.Select(e => e.ToDO()).ToList();
			return newPlacesDO;
		}

		private async Task<bool> PushPlaces(ObjectId userIdObj, List<VisitedPlaceSE> value)
		{
			var filter = DB.F<VisitedEntity>().Eq(v => v.PortalUser_id, userIdObj);
			var update = DB.U<VisitedEntity>().PushEach(v => v.Places, value);

			var res = await DB.UpdateAsync(filter, update);
			return res.ModifiedCount == 1;
		}
        
		public List<VisitedPlaceDO> GetPlacesByUsers(List<string> ids, string meId)
        {            
            var idsObj = ids.Select(i => new ObjectId(i));
            var visiteds = DB.C<VisitedEntity>().Where(v => idsObj.Contains(v.PortalUser_id)).ToList();
            
			var visitedPlaces = visiteds.SelectMany(f => f.Places);
			var visitedPlacesDO = visitedPlaces.Select(p => p.ToDO()).ToList();

			return visitedPlacesDO;			
		}

        public List<VisitedPlaceDO> GetPlacesOverall()
        {
            var placesAgg = DB.C<VisitedPlaceAggregatedEntity>().ToList();
            var cs = placesAgg.Select(country => new VisitedPlaceDO
            {
                Count = country.Visitors.Count,
                Location = country.Location,
                SourceId = country.SourceId,
                SourceType = (SourceType)country.SourceType,
                Dates = new List<DateTime>()
            }).ToList();
            return cs;
        }
    }

}