using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using Gloobster.Common;
using Gloobster.DomainModels.Services;
using Gloobster.DomainModels.Services.Facebook.FriendsExtractor;
using Gloobster.DomainModels.Services.GeonamesService;
using Gloobster.SocialLogin.Facebook.Communication;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Gloobster.UnitTests
{
	
	public class DbFiller: TestBase
	{


		[Fact]
		public async void TestTheThing()
		{
			var fbService = new FacebookService();
			fbService.SetAccessToken("CAAVlse7iUKoBAPGFvrqoCaYl3L10EyRr5OUjBqwn20LLpafg52ZB5nJjbrS4Vu54rjdqefJ6eosXAvflytTsq6iZAWcASCgPBu5DmOrZCIykcvAbxEAj226EJOwxgeCnA3oDHTpsLXJAH3wr4xKtZBKCZAFlrmkCW29kySbBYuydYVl1xe96ZCP7439bZBl76b74zmvqUZA1vQZDZD");
			var fbFriendsService = new FacebookFriendsService(fbService);

			var userId = "vaclav.mikeska";
			//var userFriends = fbFriendsService.GetFriendsByFbUserId(userId);


		}

		
		
	}

	



}
