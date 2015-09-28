using System.Linq;
using Gloobster.Common.DbEntity;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.SocialLogin.Facebook.Communication;
using TweetSharp;

namespace Gloobster.Mappers
{
	public static class TwitterUserMappers
	{
		public static TwitterUserSE ToEntity(this TwitterUser obj)
		{
			if (obj == null)
			{
				return null;
			}

			var entity = new TwitterUserSE
			{
				CreatedDate = obj.CreatedDate,
				FollowersCount = obj.FollowersCount,
				FriendsCount = obj.FriendsCount,
				//UserId = obj.Id,
				//Language = obj.Language,
				//LocationMappers = obj.LocationMappers,
				//Name = obj.Name,
				ProfileImageUrl = obj.ProfileImageUrl,
				ScreenName = obj.ScreenName,
				StatusesCount = obj.StatusesCount,
				TimeZone = obj.TimeZone,
				Url = obj.Url,
				UtcOffset = obj.UtcOffset
			};

			return entity;
		}

		public static TwitterUserDO ToDO(this TwitterUser obj)
		{
			if (obj == null)
			{
				return null;
			}

			var entity = new TwitterUserDO
			{
				CreatedDate = obj.CreatedDate,
				FollowersCount = obj.FollowersCount,
				FriendsCount = obj.FriendsCount,
				TwUserId = obj.Id,
				Language = obj.Language,
				Location = obj.Location,
				Name = obj.Name,
				ProfileImageUrl = obj.ProfileImageUrl,
				ScreenName = obj.ScreenName,
				StatusesCount = obj.StatusesCount,
				TimeZone = obj.TimeZone,
				Url = obj.Url,
				UtcOffset = obj.UtcOffset
			};

			return entity;
		}

		public static TwitterUserSE ToEntity(this TwitterUserDO obj)
		{
			if (obj == null)
			{
				return null;
			}

			var entity = new TwitterUserSE
			{
				CreatedDate = obj.CreatedDate,
				FollowersCount = obj.FollowersCount,
				FriendsCount = obj.FriendsCount,
				//UserId = obj.UserId,
				//Language = obj.Language,
				//LocationMappers = obj.LocationMappers,
				//Name = obj.Name,
				ProfileImageUrl = obj.ProfileImageUrl,
				ScreenName = obj.ScreenName,
				StatusesCount = obj.StatusesCount,
				TimeZone = obj.TimeZone,
				Url = obj.Url,
				UtcOffset = obj.UtcOffset
			};

			return entity;
		}

		public static TwitterUserDO ToDO(this TwitterUserSE entity)
		{
			if (entity == null)
			{
				return null;
			}

			var dObj = new TwitterUserDO
			{
				CreatedDate = entity.CreatedDate,
				FollowersCount = entity.FollowersCount,
				FriendsCount = entity.FriendsCount,
				//UserId = entity.UserId,
				//Language = entity.Language,
				//LocationMappers = entity.LocationMappers,
				//Name = entity.Name,
				ProfileImageUrl = entity.ProfileImageUrl,
				ScreenName = entity.ScreenName,
				StatusesCount = entity.StatusesCount,
				TimeZone = entity.TimeZone,
				Url = entity.Url,
				UtcOffset = entity.UtcOffset
			};

			return dObj;
		}



	}
}