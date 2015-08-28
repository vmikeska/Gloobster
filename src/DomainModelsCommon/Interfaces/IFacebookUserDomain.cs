using System.Threading.Tasks;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface IFacebookUserDomain
	{
		Task<UserLoggedResultDO> ValidateFacebookUser(FacebookUserAuthenticationDO fbAuth);
		Task<FacebookUserExistsDO> FacebookUserExists(string userId);

		Task<CreateFacebookUserResultDO> CreateFacebookUser(FacebookUserAuthenticationDO facebookUser);

		bool LogInFacebookUser(FacebookUserAuthenticationDO facebookUser);
	}
}