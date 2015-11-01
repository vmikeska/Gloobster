namespace Gloobster.ReqRes.Facebook
{
	public class TwitterUserAuthenticationRequest
	{		
		public string accessToken { get; set; }
		public string tokenSecret { get; set; }				
		public string userId { get; set; }
		public string expiresAt { get; set; }
		public string mail { get; set; }
	}
}