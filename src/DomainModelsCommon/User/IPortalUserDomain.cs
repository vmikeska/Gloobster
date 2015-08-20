using System.Threading.Tasks;

namespace Gloobster.DomainModelsCommon.User
{

    public enum UserCreatedState { AlreadyExists, Created }

	public class PortalUserDO
	{
		public string DisplayName { get; set; }
		public string Password { get; set; }
		public string Mail { get; set; }
	}

	public class FacebookUserExistsDO
	{
		public PortalUserDO PortalUser { get; set; }
		public bool UserExists { get; set; }
	}

	public class FacebookUserDO
	{
		public string AccessToken { get; set; }
		public string UserID { get; set; }
		public int ExpiresIn { get; set; }
		public string SignedRequest { get; set; }
	}

	public interface IPortalUserDomain
    {
        Task<UserCreatedResultDO> CreateUserBase(PortalUserDO user);
        Task<bool> UserExists(string mail);
		Task<FacebookUserExistsDO> FacebookUserExists(FacebookUserDO facebookUser);
    }
}
