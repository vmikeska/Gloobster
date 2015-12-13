using System.Threading.Tasks;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface ICreateUserData
	{
		Task<bool> Create(PortalUserDO portalUser);
	}
}