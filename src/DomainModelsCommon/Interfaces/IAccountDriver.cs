using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface IAccountDriver
	{
		IDbOperations DB { get; set; }
        PortalUserDO PortalUser { get; set; }
		Task<PortalUserDO> Create(object user);
		Task<PortalUserDO> Load(object user);
		string GetEmail(object user);
		void OnUserExists(PortalUserDO portalUser);
		void OnUserSuccessfulyLogged(PortalUserDO portalUser);

	}
}