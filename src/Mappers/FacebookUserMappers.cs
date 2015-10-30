using System.Linq;

using Gloobster.DomainObjects;
using Gloobster.Entities;

namespace Gloobster.Mappers
{
	public static class FacebookUserMappers
	{
		public static FacebookUserDO ToDO(this FacebookUserSE entity)
		{
			if (entity == null)
			{
				return null;
			}

			var dObj = new FacebookUserDO
			{
				//Email = entity.Email,				
				//FirstName = entity.FirstName,
				//Gender = entity.Gender,
				//HomeTown = entity.HomeTown.ToDO(),
				//Id = entity.UserId,				
				//LastName = entity.LastName,
				Link = entity.Link,
				Locale = entity.Locale,
				//LocationMappers = entity.LocationMappers.ToDO(),
				//Name = entity.Name,
				TimeZone = entity.TimeZone,
				UpdatedTime = entity.UpdatedTime,
				Verified = entity.Verified
			};

			if (entity.FavoriteTeams != null)
			{
				dObj.FavoriteTeams = entity.FavoriteTeams.Select(i => IdNameMappers.ToDO(i)).ToArray();
			}

			//if (entity.Languages != null)
			//{
			//	dObj.Languages = entity.Languages.Select(i => i.ToDO()).ToArray();
			//}

			return dObj;
		}

		public static FacebookUserSE ToEntity(this FacebookUserDO dObj)
		{
			if (dObj == null)
			{
				return null;
			}

			var entity = new FacebookUserSE
			{
				//Email = dObj.Email,
				FavoriteTeams = dObj.FavoriteTeams.Select(i => i.ToEntity()).ToArray(),
				//FirstName = dObj.FirstName,
				//Gender = dObj.Gender,
				//HomeTown = dObj.HomeTown.ToEntity(),
				//UserId = dObj.Id,
				//Languages = dObj.Languages.Select(i => i.ToEntity()).ToArray(),
				//LastName = dObj.LastName,
				Link = dObj.Link,
				Locale = dObj.Locale,
				//LocationMappers = dObj.LocationMappers.ToEntity(),
				//Name = dObj.Name,
				TimeZone = dObj.TimeZone,
				UpdatedTime = dObj.UpdatedTime,
				Verified = dObj.Verified
			};

			return entity;
		}

		


	}
}