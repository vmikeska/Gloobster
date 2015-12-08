using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface ITwitterShare
	{
		void Tweet(TwitterShareOptionsDO options, SocAuthenticationDO authentication);
	}
}