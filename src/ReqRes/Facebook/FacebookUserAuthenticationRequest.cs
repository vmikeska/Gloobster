namespace Gloobster.ReqRes.Facebook
{
	public class FacebookUserAuthenticationRequest
	{
		public string   accessToken { get; set; }
		public string   userId { get; set; }
		public int      expiresIn { get; set; }
		public string   signedRequest { get; set; }
	}
}