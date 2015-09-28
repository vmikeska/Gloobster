using Gloobster.Common.DbEntity.PortalUser;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.Mappers
{
	public static class UserAutenticationMappers
	{
		public static SocAuthenticationDO ToDO(this SocAuthenticationSE entity)
		{
			if (entity == null)
			{
				return null;
			}

			var dObj = new SocAuthenticationDO
			{
				UserId = entity.UserId,
				TokenSecret = entity.TokenSecret,
				AccessToken = entity.AccessToken,
				ExpiresAt = entity.ExpiresAt
			};

			return dObj;
		}

		public static SocAuthenticationSE ToEntity(this SocAuthenticationDO dObj)
		{
			if (dObj == null)
			{
				return null;
			}

			var entity = new SocAuthenticationSE
			{
				UserId = dObj.UserId,
				TokenSecret = dObj.TokenSecret,
				AccessToken = dObj.AccessToken,
				ExpiresAt = dObj.ExpiresAt
			};

			return entity;
		}
	}
}