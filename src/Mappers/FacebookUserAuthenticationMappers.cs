using Gloobster.Common.DbEntity;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.WebApiObjects;
using Gloobster.WebApiObjects.Facebook;

namespace Gloobster.Mappers
{
	public static class FacebookUserAuthenticationMappers
	{
		public static FacebookUserAuthenticationDO ToDO(this FacebookUserAuthenticationEntity authenticationEntity)
		{
			if (authenticationEntity == null)
			{
				return null;
			}

			var dObj = new FacebookUserAuthenticationDO
			{
				AccessToken = authenticationEntity.AccessToken,
				ExpiresAt = authenticationEntity.ExpiresAt,
				UserId = authenticationEntity.UserId
			};

			return dObj;
		}

		public static FacebookUserAuthenticationEntity ToEntity(this FacebookUserAuthenticationDO dObj)
		{
			if (dObj == null)
			{
				return null;
			}

			var entity = new FacebookUserAuthenticationEntity
			{
				AccessToken = dObj.AccessToken,
				ExpiresAt = dObj.ExpiresAt,				
				UserId = dObj.UserId
			};

			return entity;
		}

		public static FacebookUserAuthenticationDO ToDoFromRequest(this FacebookUserAuthenticationRequest request)
		{
			if (request == null)
			{
				return null;
			}

			var dObj = new FacebookUserAuthenticationDO
			{
				AccessToken = request.accessToken,
				//ExpiresAt = request.expiresIn,
				UserId = request.userID
			};

			return dObj;

		}

		//public static FacebookUserAuthenticationEntity ToEntityFromFO(this Face fo)
		//{
		//	if (fo == null)
		//	{
		//		return null;
		//	}
	
		//	var entity = new FacebookUserAuthenticationEntity
		//	{
		//		AccessToken = fo.
		//	}

		//	return entity;
		//}


	}
}