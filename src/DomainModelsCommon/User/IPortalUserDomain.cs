using System.Threading.Tasks;

namespace Gloobster.DomainModelsCommon.User
{

    public enum UserCreatedState { AlreadyExists, Created }

	public class PortalUserDO
	{
		public string DisplayName { get; set; }
		public string Password { get; set; }
		public string Mail { get; set; }
		public FacebookGroupDO Facebook { get; set; }
	}

	public class FacebookGroupDO
	{
		public FacebookUserAuthenticationDO Authentication { get; set; }
		public FacebookUserDO FacebookUser { get; set; }
	}

	public class FacebookUserDO
	{
		public string Id { get; set; }
		public string Email { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string Gender { get; set; }
		public string Link { get; set; }
		public string Locale { get; set; }
		public string Name { get; set; }
		public int TimeZone { get; set; }
		public bool Verified { get; set; }
		public string UpdatedTime { get; set; }
		public IdNameDO[] FavoriteTeams { get; set; }
		public IdNameDO HomeTown { get; set; }
		public IdNameDO[] Languages { get; set; }
		public IdNameDO Location { get; set; }
	}
	public class IdNameDO
	{
		public string Id { get; set; }
		public string Name { get; set; }
	}

	public class FacebookUserExistsDO
	{
		public PortalUserDO PortalUser { get; set; }
		public bool UserExists { get; set; }
	}

	public class FacebookUserAuthenticationDO
	{
		public string AccessToken { get; set; }
		public string UserID { get; set; }
		public int ExpiresIn { get; set; }
		public string SignedRequest { get; set; }
	}

	public enum UserLogged { Successful, UnknownFailure, BadCredintials}

	public class UserLoggedResultDO
	{
		public UserLogged Status { get; set; }
		public bool RegisteredNewUser { get; set; }
		public bool IsStandardUser { get; set; }
		public bool IsFacebook { get; set; }
	}

	public enum UserCreated { Successful, UserExists, WrongAccessToken}

	public class CreateFacebookUserResultDO
	{
		public UserCreated Status { get; set; }
		public PortalUserDO CreatedUser { get; set; }
	}

	public interface IPortalUserDomain
    {
        Task<UserCreatedResultDO> CreateUserBase(PortalUserDO user);
        Task<bool> UserExists(string mail);
		Task<UserLoggedResultDO> ValidateOrCreateUser(PortalUserDO portalUser);
    }

	public interface IFacebookUserDomain
	{
		Task<UserLoggedResultDO> ValidateFacebookUser(FacebookUserAuthenticationDO fbAuth);
        Task<FacebookUserExistsDO> FacebookUserExists(string userId);

		Task<CreateFacebookUserResultDO> CreateFacebookUser(FacebookUserAuthenticationDO facebookUser);

		bool LogInFacebookUser(FacebookUserAuthenticationDO facebookUser);
	}
}
