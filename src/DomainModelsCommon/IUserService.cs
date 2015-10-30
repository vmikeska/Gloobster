using System.Threading.Tasks;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface IUserService
	{
		IAccountDriver AccountDriver { get; set; }
        Task<UserLoggedResultDO> Validate(SocAuthenticationDO authentication, object userObj);
	}
}