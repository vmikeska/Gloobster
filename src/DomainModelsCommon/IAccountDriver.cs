using System.Threading.Tasks;
using Autofac;
using Gloobster.Database;
using Gloobster.DomainObjects;
using Gloobster.Enums;

namespace Gloobster.DomainInterfaces
{
	public interface IAccountDriver
	{
		bool CheckCredintials(object authObject, UserDO portalUser);

		SocialNetworkType NetworkType { get; }

		SocAuthenticationDO Authentication { get; set; }
		object UserObj { get; set; }
		IComponentContext ComponentContext { get; set; }
		IDbOperations DB { get; set; }
        UserDO PortalUser { get; set; }
		Task<UserDO> Create();		
		string GetEmail();
		void OnUserExists(UserDO portalUser);
		void OnUserSuccessfulyLogged(UserDO portalUser);
	}
    
    public interface ISocLogin
    {
        bool ValidateToken(string token);
        Task<UserDO> GetUserData(SocAuthDO auth);
        PermanentTokenDO TryGetPermanentToken(string standardAccessToken);
        string GetProfilePicUrl(SocAuthDO auth);
    }

    public interface ISocNetworkService
    {
        ISocLogin SocLogin { get; set; }
        Task<LoginResponseDO> HandleAsync(SocAuthDO auth);
    }

    public interface IAccountDomain
    {
        SocAuthDO GetAuth(SocialNetworkType netType, string userId);
    }
}