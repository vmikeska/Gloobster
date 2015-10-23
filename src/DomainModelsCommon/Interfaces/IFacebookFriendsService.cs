using System.Collections.Generic;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModels.Services.Facebook.FriendsExtractor
{
	public interface IFacebookFriendsService
	{
		List<PortalUserDO> GetFriends(string userId);
	}
}