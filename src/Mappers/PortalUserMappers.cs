using System.Linq;
using Gloobster.Common.DbEntity;
using Gloobster.Common.DbEntity.PortalUser;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.WebApiObjects;
using MongoDB.Bson;

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
				UserId = entity.id.ToString(),
				Gender = entity.Gender,								
				FirstName = entity.FirstName,
				LastName = entity.LastName,
				ProfileImage = entity.ProfileImage,
				HomeLocation = entity.HomeLocation.ToDO(),
				CurrentLocation = entity.CurrentLocation.ToDO()
			};

			if (entity.SocialAccounts != null)
			{
				dObj.SocialAccounts = entity.SocialAccounts.Select(a => a.ToDO()).ToArray();
			}

			if (entity.Languages != null)
			{
				dObj.Languages = entity.Languages.Select(l => l.ToDO()).ToArray();
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
				Password = dObj.Password,
				id = new ObjectId(dObj.UserId),
				Gender = dObj.Gender,
				FirstName = dObj.FirstName,
				LastName = dObj.LastName,
				ProfileImage = dObj.ProfileImage,
				HomeLocation = dObj.HomeLocation.ToEntity(),
				CurrentLocation = dObj.CurrentLocation.ToEntity()
			};

			if (dObj.SocialAccounts != null)
			{
				entity.SocialAccounts = dObj.SocialAccounts.Select(a => a.ToEntity()).ToArray();
			}

			if (dObj.Languages != null)
			{
				entity.Languages = dObj.Languages.Select(l => l.ToEntity()).ToArray();
			}

			return entity;
		}

	}
}