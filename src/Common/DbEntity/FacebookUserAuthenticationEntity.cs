namespace Gloobster.Common.DbEntity
{
	public class FacebookUserAuthenticationEntity
	{
		public string AccessToken { get; set; }
		public string UserId { get; set; }
		public int ExpiresIn { get; set; }
		public string SignedRequest { get; set; }


	}
}