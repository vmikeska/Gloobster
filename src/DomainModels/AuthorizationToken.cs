namespace Gloobster.DomainModels
{
	public class AuthorizationToken
	{
		public AuthorizationToken() { }

		public AuthorizationToken(string userId)
		{
			UserId = userId;
		}

		public string UserId { get; set; }
	}
}