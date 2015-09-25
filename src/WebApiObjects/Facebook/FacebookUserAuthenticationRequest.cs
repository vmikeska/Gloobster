namespace Gloobster.WebApiObjects.Facebook
{
	public class FacebookUserAuthenticationRequest
	{
		public string accessToken { get; set; }
		public string userID { get; set; }
		public int expiresIn { get; set; }
		public string signedRequest { get; set; }
	}
}