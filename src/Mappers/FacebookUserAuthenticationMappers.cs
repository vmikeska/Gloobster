using Gloobster.Common.DbEntity;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.WebApiObjects;

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
				ExpiresIn = authenticationEntity.ExpiresIn,
				SignedRequest = authenticationEntity.SignedRequest,
				UserID = authenticationEntity.UserId
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
				ExpiresIn = dObj.ExpiresIn,
				SignedRequest = dObj.SignedRequest,
				UserId = dObj.UserID
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
				ExpiresIn = request.expiresIn,
				SignedRequest = request.signedRequest,
				UserID = request.userID
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