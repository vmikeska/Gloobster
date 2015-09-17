using System;

namespace Gloobster.Common.DbEntity
{

	public class TwitterUserEntity
	{
		public long TwUserId { get; set; }
		public int FollowersCount { get; set; }
		public string Name { get; set; }
		public string ProfileImageUrl { get; set; }
		public object Url { get; set; }
		public string ScreenName { get; set; }
		public string Location { get; set; }
		public int FriendsCount { get; set; }
		public object UtcOffset { get; set; }
		public object TimeZone { get; set; }
		public int StatusesCount { get; set; }
		public string Language { get; set; }
		public DateTime CreatedDate { get; set; }
	}
}
