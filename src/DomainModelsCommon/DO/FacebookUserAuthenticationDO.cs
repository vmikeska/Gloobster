namespace Gloobster.DomainModelsCommon.DO
{
	public class FacebookUserAuthenticationDO
	{
		public string AccessToken { get; set; }
		public string UserID { get; set; }
		public int ExpiresIn { get; set; }
		public string SignedRequest { get; set; }
	}
}