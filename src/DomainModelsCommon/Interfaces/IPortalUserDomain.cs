using System.Threading.Tasks;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface IPortalUserDomain
    {
        Task<UserCreatedResultDO> CreateUserBase(PortalUserDO user);
        Task<bool> UserExists(string mail);
		Task<UserLoggedResultDO> ValidateOrCreateUser(PortalUserDO portalUser);
    }
}
