namespace Gloobster.Common.DbEntity
{
	public class TwitterUserAuthenticationEntity
	{
		public string Token { get; set; }
		public string TokenSecret { get; set; }
		public long TwUserId { get; set; }
	}
}