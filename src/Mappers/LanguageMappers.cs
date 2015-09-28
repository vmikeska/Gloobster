using Gloobster.Common.DbEntity.PortalUser;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.Mappers
{
	public static class LanguageMappers
	{
		public static LanguageDO ToDO(this LanguageSE entity)
		{
			if (entity == null)
			{
				return null;
			}

			var dObj = new LanguageDO
			{
				Name = entity.Name,
				LanguageId = entity.LanguageId
			};

			return dObj;
		}

		public static LanguageSE ToEntity(this LanguageDO dObj)
		{
			if (dObj == null)
			{
				return null;
			}

			var entity = new LanguageSE
			{
				Name = dObj.Name,
				LanguageId = dObj.LanguageId
			};

			return entity;
		}
	}
}