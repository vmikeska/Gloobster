namespace Gloobster.DomainModelsCommon.DO
{
	public class TwitterUserAuthenticationDO
	{
		public string Token { get; set; }
		public string TokenSecret { get; set; }
		public long TwUserId { get; set; }
	}
}