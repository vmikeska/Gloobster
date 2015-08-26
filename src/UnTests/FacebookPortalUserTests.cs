using System.Linq;
using Gloobster.Common.DbEntity;
using Gloobster.DomainModels;
using Gloobster.DomainModelsCommon.User;
using Gloobster.SocialLogin.Facebook.Communication;
using Moq;
using Xunit;

namespace Gloobster.UnitTests
{
	public class FacebookPortalUserTests : TestBase
	{
		public Mock<IFacebookService> FacebookServiceMock;

		public FacebookPortalUserTests()
		{
			FacebookServiceMock = new Mock<IFacebookService>();
			FacebookServiceMock
				.Setup(f => f.Get<FacebookUserFO>("/me"))
				.Returns(UserCreations.CreateFacebookUserFO1());

			FBUserDomain = new FacebookUserDomain(DBOper, FacebookServiceMock.Object);
		}
		
		public FacebookUserDomain FBUserDomain { get; set; }
		
		[Fact]
		public async void facebook_user_should_exist()
		{
			DBOper.DropCollection<PortalUserEntity>();

			PortalUserEntity userEntity1 = await UserCreations.CreatePortalUserEntity1(true);

			var userDo1 = UserCreations.CreatePortalUserDO1(true);

			var fbResult = await FBUserDomain.FacebookUserExists(userDo1.Facebook.Authentication.UserID);

			Assert.True(fbResult.UserExists);
		}

		[Fact]
		public async void should_create_facebook_user()
		{
			DBOper.DropCollection<PortalUserEntity>();
			
			var user = UserCreations.CreateFacebookUserAuthenticationDO();

			var result = await FBUserDomain.CreateFacebookUser(user);
			
            Assert.Equal(result.Status, UserCreated.Successful);

			var usr = result.CreatedUser.Facebook.FacebookUser;
            Assert.Equal(UserCreations.FirstName1, usr.FirstName);
			Assert.Equal(UserCreations.LastName1, usr.LastName);
			Assert.Equal(UserCreations.Mail1, usr.Email);
		}

		[Fact]
		public async void should_not_create_facebook_user_user_exists()
		{
			DBOper.DropCollection<PortalUserEntity>();

			var user1 = UserCreations.CreatePortalUserEntity1(true, true);
			
			var user = UserCreations.CreateFacebookUserAuthenticationDO();			
			var result = await FBUserDomain.CreateFacebookUser(user);

			Assert.Equal(result.Status, UserCreated.UserExists);			
		}

		[Fact]
		public async void should_validate_and_create_new_user()
		{
			DBOper.DropCollection<PortalUserEntity>();

			var newUser = UserCreations.CreateFacebookUserDO1();

			var result = await FBUserDomain.ValidateFacebookUser(newUser);


			Assert.Equal(result.Status, UserLogged.Successful);
			Assert.True(result.RegisteredNewUser);
		}

		[Fact]
		public async void should_validate_and_found_user()
		{
			DBOper.DropCollection<PortalUserEntity>();

			await UserCreations.CreatePortalUserEntity1(true, true);

			var newUser = UserCreations.CreateFacebookUserDO1();

			var result = await FBUserDomain.ValidateFacebookUser(newUser);


			Assert.Equal(result.Status, UserLogged.Successful);
			Assert.False(result.RegisteredNewUser);
		}


		[Fact]
		public async void ExtractFacebookTaggedPlaces()
		{
			var extractor = new FacebookTaggedPlacesExtractor(new FacebookService());
			extractor.AccessToken =
				"CAAVlse7iUKoBAJZCwNszsZCvgOR6i36lWCfZCVDkP4taDh2NWsabfZA0XfWqzvWvZAGswJ2MHzCr1xt9KmRQPnUYMbjNvQHRmurE6C8VZBUB3WoG9ZBu7S3m8ql0i9d4Gr9QTo90F3GQeB7PuVQbcVDEHBCj4m7umPgDgHZBNUMvunWsvJOjntspWSvyPt199AsBaErcJIuRZBwZDZD";
			extractor.UserId = "10202803343824427";

			extractor.ExtractAll();
		}



		//[Fact]
		//public async void should_login_fb_user()
		//{
		//	var fbUser = new FacebookUserAuthenticationDO
		//	{
		//		AccessToken =
		//			"dCAAVlse7iUKoBAJ76BM4cCZABomce0yHqr6rJTUoSOrv6ZCQpRzisazUkOZBzerv2JsHiF73gSwm2zakwZBAuZCOnWlkbahRp5ZBbFm2A7uGpsamQFJbdBYNftFk5ZAaj3cItQsnOXcu0NxUoke8L6bbvG1gJJbYMj7JRrYlDX94ASlKKBCFwCoIekKMX7ujl171h7sKkooIIgZDZD"
		//	};

		//	var res = await FBUserDomain.LogInFacebookUser(fbUser);
		//	var tst = res.ToString();
		//}


	}
	
}