namespace Gloobster.Common.DbEntity
{
	public class GoogleGroupEntity
	{
		public GoogleUserAuthenticationEntity Authentication { get; set; }
		public GoogleUserEntity GoogleUser { get; set; }
	}
}