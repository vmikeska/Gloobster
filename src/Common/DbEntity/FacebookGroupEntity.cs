namespace Gloobster.Common.DbEntity
{
	public class FacebookGroupEntity
	{
		public FacebookUserAuthenticationEntity Authentication { get; set; }
		public FacebookUserEntity FacebookUser { get; set; }
	}
}