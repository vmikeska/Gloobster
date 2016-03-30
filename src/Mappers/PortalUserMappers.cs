using System.Linq;

using Gloobster.DomainObjects;
using Gloobster.Entities;
using MongoDB.Bson;

namespace Gloobster.Mappers
{
	public static class PortalUserMappers
	{
		public static UserDO ToDO(this UserEntity entity)
		{
			if (entity == null)
			{
				return null;
			}

			var dObj = new UserDO
			{
				DisplayName = entity.DisplayName,				
				UserId = entity.id.ToString(),
				Gender = entity.Gender,								
				FirstName = entity.FirstName,
				LastName = entity.LastName,
                HasProfileImage = entity.HasProfileImage,
				HomeLocation = entity.HomeLocation.ToDO(),
				CurrentLocation = entity.CurrentLocation.ToDO(),
                Languages = entity.Languages                
			};
            
			return dObj;
		}

		public static UserEntity ToEntity(this UserDO d)
		{
			if (d == null)
			{
				return null;
			}

			var entity = new UserEntity
			{
				DisplayName = d.DisplayName,
				id = new ObjectId(d.UserId),
				Gender = d.Gender,
				FirstName = d.FirstName,
				LastName = d.LastName,
				HasProfileImage = d.HasProfileImage,
				HomeLocation = d.HomeLocation.ToEntity(),
				CurrentLocation = d.CurrentLocation.ToEntity(),
                Languages = d.Languages

			};
            
			return entity;
		}

	}
}