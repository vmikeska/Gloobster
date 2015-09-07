namespace Gloobster.DomainModelsCommon.DO
{
	public class UserLoggedResultDO
	{
		public UserLogged Status { get; set; }
		public bool RegisteredNewUser { get; set; }
		public bool IsStandardUser { get; set; }
		public bool IsFacebook { get; set; }
		public string EncodedToken { get; set; }
		public string UserId { get; set; }
	}
}