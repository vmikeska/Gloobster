using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface IFacebookShare
	{
		void Share(FacebookShareOptionsDO so, SocAuthDO authentication);
        bool Checkin(FacebookCheckinDO checkin, SocAuthDO authentication);
	}
}