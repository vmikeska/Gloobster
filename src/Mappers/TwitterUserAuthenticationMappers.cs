using Gloobster.Common.DbEntity;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.Mappers
{
	public static class TwitterUserAuthenticationMappers
	{
		public static TwitterUserAuthenticationEntity ToEntity(this TwitterUserAuthenticationDO obj)
		{
			if (obj == null)
			{
				return null;
			}

			var entity = new TwitterUserAuthenticationEntity
			{
				Token = obj.Token,
				TokenSecret = obj.TokenSecret,
				TwUserId = obj.TwUserId
			};

			return entity;
		}

		public static TwitterUserAuthenticationDO ToDO(this TwitterUserAuthenticationEntity entity)
		{
			if (entity == null)
			{
				return null;
			}

			var obj = new TwitterUserAuthenticationDO
			{
				Token = entity.Token,
				TokenSecret = entity.TokenSecret,
				TwUserId = entity.TwUserId
			};

			return obj;
		}
	}
}