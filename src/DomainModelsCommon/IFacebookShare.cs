using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface IFacebookShare
	{
		void Share(FacebookShareOptionsDO so, SocAuthenticationDO authentication);
	}
}