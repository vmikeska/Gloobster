using System.Threading.Tasks;
using Autofac;
using Gloobster.Database;
using Gloobster.DomainObjects;
using Gloobster.Enums;

namespace Gloobster.DomainInterfaces
{
	public interface IAccountDriver
	{
		bool CheckCredintials(object authObject, PortalUserDO portalUser);

		SocialNetworkType NetworkType { get; }

		SocAuthenticationDO Authentication { get; set; }
		object UserObj { get; set; }
		IComponentContext ComponentContext { get; set; }
		IDbOperations DB { get; set; }
        PortalUserDO PortalUser { get; set; }
		Task<PortalUserDO> Create();		
		string GetEmail();
		void OnUserExists(PortalUserDO portalUser);
		void OnUserSuccessfulyLogged(PortalUserDO portalUser);

	}
}