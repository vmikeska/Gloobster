using Gloobster.Common.DbEntity;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.SocialLogin.Facebook.Communication;

namespace Gloobster.Mappers
{
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
}