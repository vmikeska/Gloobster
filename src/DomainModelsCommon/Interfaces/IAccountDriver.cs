using System.Threading.Tasks;
using Autofac;
using Gloobster.Common;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface IAccountDriver
	{
		object UserObj { get; set; }
		IComponentContext ComponentContext { get; set; }
		IDbOperations DB { get; set; }
        PortalUserDO PortalUser { get; set; }
		Task<PortalUserDO> Create();
		Task<PortalUserDO> Load();
		string GetEmail();
		void OnUserExists(PortalUserDO portalUser);
		void OnUserSuccessfulyLogged(PortalUserDO portalUser);

	}
}