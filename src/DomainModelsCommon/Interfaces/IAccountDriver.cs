using System.Threading.Tasks;
using Autofac;
using Gloobster.Common;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface IAccountDriver
	{
		IComponentContext ComponentContext { get; set; }
		IDbOperations DB { get; set; }
        PortalUserDO PortalUser { get; set; }
		Task<PortalUserDO> Create(object user);
		Task<PortalUserDO> Load(object user);
		string GetEmail(object user);
		void OnUserExists(PortalUserDO portalUser);
		void OnUserSuccessfulyLogged(PortalUserDO portalUser);

	}
}