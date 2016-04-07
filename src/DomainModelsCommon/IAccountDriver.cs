using System.Threading.Tasks;
using Autofac;
using Gloobster.Database;
using Gloobster.DomainObjects;
using Gloobster.Enums;

namespace Gloobster.DomainInterfaces
{	
    public class TokenValidationResultDO
    {
        public bool IsValid { get; set; }
        public string UserId { get; set; }
    }

    public interface ISocLogin
    {
        void Init(SocAuthDO auth);        
        TokenValidationResultDO ValidateToken(SocAuthDO auth);
        Task<UserDO> GetUserData(SocAuthDO auth);
        PermanentTokenDO TryGetPermanentToken(string standardAccessToken);
        string GetProfilePicUrl(SocAuthDO auth);
        Task OnNewUser(SocAuthDO auth);
    }

    public interface ISocNetworkService
    {
        ISocLogin SocLogin { get; set; }
        Task<LoginResponseDO> HandleAsync(SocAuthDO auth);
        Task<LoginResponseDO> HandleEmail(string mail, string password, string userId);
    }

    public interface IAccountDomain
    {
        SocAuthDO GetAuth(SocialNetworkType netType, string userId);
    }
}