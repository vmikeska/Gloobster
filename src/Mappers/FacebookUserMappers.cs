using System.Linq;
using Gloobster.Common.DbEntity;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.SocialLogin.Facebook.Communication;

namespace Gloobster.Mappers
{
	public static class FacebookUserMappers
	{
		public static FacebookUserDO ToDO(this FacebookUserEntity entity)
		{
			if (entity == null)
			{
				return null;
			}

			var dObj = new FacebookUserDO
			{
				Email = entity.Email,				
				FirstName = entity.FirstName,
				Gender = entity.Gender,
				HomeTown = entity.HomeTown.ToDO(),
				Id = entity.UserId,				
				LastName = entity.LastName,
				Link = entity.Link,
				Locale = entity.Locale,
				Location = entity.Location.ToDO(),
				Name = entity.Name,
				TimeZone = entity.TimeZone,
				UpdatedTime = entity.UpdatedTime,
				Verified = entity.Verified
			};

			if (entity.FavoriteTeams != null)
			{
				dObj.FavoriteTeams = entity.FavoriteTeams.Select(i => IdNameMappers.ToDO(i)).ToArray();
			}

			if (entity.Languages != null)
			{
				dObj.Languages = entity.Languages.Select(i => i.ToDO()).ToArray();
			}

			return dObj;
		}

		public static FacebookUserEntity ToEntity(this FacebookUserDO dObj)
		{
			if (dObj == null)
			{
				return null;
			}

			var entity = new FacebookUserEntity
			{
				Email = dObj.Email,
				FavoriteTeams = dObj.FavoriteTeams.Select(i => i.ToEntity()).ToArray(),
				FirstName = dObj.FirstName,
				Gender = dObj.Gender,
				HomeTown = dObj.HomeTown.ToEntity(),
				UserId = dObj.Id,
				Languages = dObj.Languages.Select(i => i.ToEntity()).ToArray(),
				LastName = dObj.LastName,
				Link = dObj.Link,
				Locale = dObj.Locale,
				Location = dObj.Location.ToEntity(),
				Name = dObj.Name,
				TimeZone = dObj.TimeZone,
				UpdatedTime = dObj.UpdatedTime,
				Verified = dObj.Verified
			};

			return entity;
		}

		public static FacebookUserEntity ToEntity(this FacebookUserFO fo)
		{
			if (fo == null)
			{
				return null;
			}

			var entity = new FacebookUserEntity
			{
				Email = fo.Email,
				FavoriteTeams = fo.FavoriteTeams.Select(i => i.ToEntity()).ToArray(),
				FirstName = fo.FirstName,
				Gender = fo.Gender,
				HomeTown = fo.HomeTown.ToEntity(),
				UserId = fo.Id,				
				LastName = fo.LastName,
				Link = fo.Link,
				Locale = fo.Locale,
				Location = fo.Location.ToEntity(),
				Name = fo.Name,
				TimeZone = fo.TimeZone,
				UpdatedTime = fo.UpdatedTime,
				Verified = fo.Verified
			};

			if (fo.Languages != null)
			{
				entity.Languages = fo.Languages.Select(i => i.ToEntity()).ToArray();
			}

			return entity;

		}


	}
}