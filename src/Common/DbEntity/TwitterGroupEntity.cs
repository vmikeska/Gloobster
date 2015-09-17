namespace Gloobster.Common.DbEntity
{
	public class TwitterGroupEntity
	{
		public TwitterUserAuthenticationEntity Authentication { get; set; }
		public TwitterUserEntity TwitterUser { get; set; }
	}
}