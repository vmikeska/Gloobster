
using Gloobster.Common.DbEntity;
using Gloobster.DomainModelsCommon.User;
using Gloobster.SocialLogin.Facebook.Communication;
using Gloobster.WebApiObjects;
using System.Linq;

namespace Gloobster.Mappers
{
	public static class PortalUserMappers
	{
		public static PortalUserDO ToDO(this PortalUserEntity entity)
		{
			if (entity == null)
			{
				return null;
			}

			var dObj = new PortalUserDO
			{
				DisplayName = entity.DisplayName,
				Mail = entity.Mail,
				Password = entity.Password
			};

			if (entity.Facebook != null)
			{
				dObj.Facebook = new FacebookGroupDO
				{
					Authentication = entity.Facebook.Authentication.ToDO(),
					FacebookUser = entity.Facebook.FacebookUser.ToDO()
				};
			}

			return dObj;
		}

		public static PortalUserEntity ToEntity(this PortalUserDO dObj)
		{
			if (dObj == null)
			{
				return null;
			}

			var entity = new PortalUserEntity
			{
				DisplayName = dObj.DisplayName,
				Mail = dObj.Mail,
				Password = dObj.Password
			};

			if (entity.Facebook != null)
			{
				entity.Facebook = new FacebookGroupEntity
				{
					FacebookUser = dObj.Facebook.FacebookUser.ToEntity(),
					Authentication = dObj.Facebook.Authentication.ToEntity()
				};					
			}

			return entity;
		}

		public static PortalUserDO ToDoFromRequest(this PortalUserRequest request)
		{
			if (request == null)
			{
				return null;
			}

			var dObj = new PortalUserDO
			{
				DisplayName = request.displayName,
				Mail = request.mail,
				Password = request.password
			};

			if (request.facebookUser != null)
			{
				dObj.Facebook = new FacebookGroupDO
				{
					Authentication = request.facebookUser.ToDoFromRequest()
				};
			}


			return dObj;

		}


	}

	public static class IdNameMappers
	{
		public static IdNameDO ToDO(this IdNameEntity entity)
		{
			if (entity == null)
			{
				return null;
			}

			var dObj = new IdNameDO
			{
				Id = entity.Id,
				Name = entity.Name
			};				

			return dObj;
		}

		public static IdNameEntity ToEntity(this IdNameDO dObj)
		{
			if (dObj == null)
			{
				return null;
			}

			var entity = new IdNameEntity
			{
				Id = dObj.Id,
				Name = dObj.Name
			};

			return entity;
		}

		public static IdNameEntity ToEntity(this IdNameFO fo)
		{
			if (fo == null)
			{
				return null;
			}

			var entity = new IdNameEntity
			{
				Id = fo.Id,
				Name = fo.Name
			};

			return entity;
		}
	}

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
				dObj.FavoriteTeams = entity.FavoriteTeams.Select(i => i.ToDO()).ToArray();
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
				Languages = fo.Languages.Select(i => i.ToEntity()).ToArray(),
				LastName = fo.LastName,
				Link = fo.Link,
				Locale = fo.Locale,
				Location = fo.Location.ToEntity(),
				Name = fo.Name,
				TimeZone = fo.TimeZone,
				UpdatedTime = fo.UpdatedTime,
				Verified = fo.Verified
			};

			return entity;

		}


	}

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