using System.Linq;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using MongoDB.Bson;

namespace Gloobster.Mappers
{
	public static class FriendsMappers
	{
		public static FriendsDO ToDO(this FriendsEntity entity)
		{
			if (entity == null)
			{
				return null;
			}

			var dObj = new FriendsDO
			{
				id = entity.id.ToString(),
				UserId = entity.User_id.ToString(),
				Friends = entity.Friends.Select(f => f.ToString()).ToList(),
				AwaitingConfirmation = entity.AwaitingConfirmation.Select(f => f.ToString()).ToList(),
				Proposed = entity.Proposed.Select(f => f.ToString()).ToList(),
				Blocked = entity.Blocked.Select(f => f.ToString()).ToList()
			};

			return dObj;
		}

		public static FriendsEntity ToEntity(this FriendsDO dObj)
		{
			if (dObj == null)
			{
				return null;
			}

			var entity = new FriendsEntity
			{
				User_id = new ObjectId(dObj.UserId),
				Friends = dObj.Friends.Select(f => new ObjectId(f)).ToList(),
				AwaitingConfirmation = dObj.AwaitingConfirmation.Select(f => new ObjectId(f)).ToList(),
				Proposed = dObj.Proposed.Select(f => new ObjectId(f)).ToList(),
				Blocked = dObj.Blocked.Select(f => new ObjectId(f)).ToList()
			};

			return entity;
		}
	}
}