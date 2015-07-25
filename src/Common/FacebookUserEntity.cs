namespace Gloobster.Common
{
	public class FacebookUserEntity
	{
		public int Id { get; set; }

		public string Status { get; set; }
		public string AccessToken { get; set; }
		public int ExpiresIn { get; set; }
		public string SignedRequest { get; set; }
		public string UserId { get; set; }
	}
}
