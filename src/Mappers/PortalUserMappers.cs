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
				dObj.Twitter = new TwitterGroupDO
				{
					Authentication = entity.Twitter.Authentication.ToDO(),
					TwitterUser = entity.Twitter.TwitterUser.ToDO()
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

			if (dObj.Facebook != null)
			{
				entity.Facebook = new FacebookGroupEntity
				{
					FacebookUser = dObj.Facebook.FacebookUser.ToEntity(),
					Authentication = dObj.Facebook.Authentication.ToEntity()
				};					
			}

			if (dObj.Twitter != null)
			{				
                entity.Twitter = new TwitterGroupEntity
				{
					Authentication = dObj.Twitter.Authentication.ToEntity(),
					TwitterUser = dObj.Twitter.TwitterUser.ToEntity()
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
			
			return dObj;

		}


	}
}