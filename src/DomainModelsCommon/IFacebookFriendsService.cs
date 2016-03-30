using System.Collections.Generic;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface IFacebookFriendsService
	{
		List<UserDO> GetFriends(string userId);
	}
}