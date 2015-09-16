
using Gloobster.Common.DbEntity;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.WebApiObjects;

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
				Password = entity.Password,
				DbUserId = entity.id.ToString()
			};

			if (entity.Facebook != null)
			{
				dObj.Facebook = new FacebookGroupDO
				{
					Authentication = entity.Facebook.Authentication.ToDO(),
					FacebookUser = entity.Facebook.FacebookUser.ToDO()
				};
			}

			if (entity.Twitter != null)
			{
				//dObj.
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

			if (entity.Twitter != null)
			{

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
}