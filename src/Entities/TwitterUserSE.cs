using System;

namespace Gloobster.Entities
{
	public class TwitterUserSE: SpecificsUserBase
	{
		public int FollowersCount { get; set; }
		public object Url { get; set; }
		public string ScreenName { get; set; }		
		public int FriendsCount { get; set; }				
		public DateTime CreatedDate { get; set; }
		public string ProfileImageUrl { get; set; }

		//consider to remove - dynamic value
		public int StatusesCount { get; set; }
		

		//is it useful ?
		public object UtcOffset { get; set; }
		public object TimeZone { get; set; }
	}
}
