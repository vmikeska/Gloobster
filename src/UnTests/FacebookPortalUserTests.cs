//using System.Linq;
//using Gloobster.Common.DbEntity;
//using Gloobster.DomainModels;
//using Gloobster.DomainModels.Services;
//using Gloobster.DomainModels.Services.CountryService;
//using Gloobster.DomainModels.Services.Facebook.TaggedPlacesExtractor;
//using Gloobster.DomainModels.Services.GeonamesService;
//using Gloobster.DomainModelsCommon.DO;
//using Gloobster.SocialLogin.Facebook.Communication;
//using Moq;
//using Xunit;

//namespace Gloobster.UnitTests
//{
//	public class FacebookPortalUserTests : TestBase
//	{
//		public Mock<IFacebookService> FacebookServiceMock;

//		public FacebookPortalUserTests()
//		{
			

//			FacebookServiceMock = new Mock<IFacebookService>();
//			FacebookServiceMock
//				.Setup(f => f.Get<FacebookUserFO>("/me"))
//				.Returns(UserCreations.CreateFacebookUserFO1());

//			var countryService = new CountryService();
//			var geoNamesService = new GeoNamesService();
//			var visitedPlacesDomain = new VisitedCitiesDomain(DBOper);

//			var taggedPlaces = new FacebookTaggedPlacesExtractor(FacebookServiceMock.Object, countryService, geoNamesService);
//			var visitedCountries = new VisitedCountriesDomain(DBOper);

//			FBUserDomain = new FacebookDomain(DBOper, FacebookServiceMock.Object, taggedPlaces, visitedPlacesDomain, visitedCountries);
//		}
		
//		public FacebookDomain FBUserDomain { get; set; }
		
//		[Fact]
//		public async void facebook_user_should_exist()
//		{
//			DBOper.DropCollection<PortalUserEntity>();

//			PortalUserEntity userEntity1 = await UserCreations.CreatePortalUserEntity1(true);

//			var userDo1 = UserCreations.CreatePortalUserDO1(true);

//			var fbResult = await FBUserDomain.FacebookUserExists(userDo1.Facebook.AuthenticationSE.UserId);

//			Assert.True(fbResult.UserExists);
//		}

//		//"xunit": "2.1.0-rc1-build3168",
//		//"xunit.runner.dnx": "2.1.0-beta5-build169",
//		//"DomainModels": "1.0.0-*",
//		//"Microsoft.Framework.Configuration.Json": "1.0.0-beta7",
//		//"Microsoft.Framework.Configuration.EnvironmentVariables": "1.0.0-beta7",
//		//"Moq": "4.2.1507.118",
//		//"TweetSharp": "2.3.1"

//		[Fact]
//		public async void should_create_facebook_user()
//		{
//			DBOper.DropCollection<PortalUserEntity>();
			
//			var user = UserCreations.CreateFacebookUserAuthenticationDO();

//			var result = await FBUserDomain.CreateFacebookUser(user);
			
//            Assert.Equal(result.Status, UserCreated.Successful);

//			var usr = result.CreatedUser.Facebook.FacebookUser;
//            Assert.Equal(UserCreations.FirstName1, usr.FirstName);
//			Assert.Equal(UserCreations.LastName1, usr.LastName);
//			Assert.Equal(UserCreations.Mail1, usr.Email);
//		}

//		[Fact]
//		public async void should_not_create_facebook_user_user_exists()
//		{
//			DBOper.DropCollection<PortalUserEntity>();

//			var user1 = UserCreations.CreatePortalUserEntity1(true, true);
			
//			var user = UserCreations.CreateFacebookUserAuthenticationDO();			
//			var result = await FBUserDomain.CreateFacebookUser(user);

//			Assert.Equal(result.Status, UserCreated.UserExists);			
//		}

//		[Fact]
//		public async void should_validate_and_create_new_user()
//		{
//			DBOper.DropCollection<PortalUserEntity>();

//			var newUser = UserCreations.CreateFacebookUserDO1();

//			var result = await FBUserDomain.ValidateFacebookUser(newUser);


//			Assert.Equal(result.Status, UserLogged.Successful);
//			Assert.True(result.RegisteredNewUser);
//		}

//		[Fact]
//		public async void should_validate_and_found_user()
//		{
//			DBOper.DropCollection<PortalUserEntity>();

//			await UserCreations.CreatePortalUserEntity1(true, true);

//			var newUser = UserCreations.CreateFacebookUserDO1();

//			var result = await FBUserDomain.ValidateFacebookUser(newUser);


//			Assert.Equal(result.Status, UserLogged.Successful);
//			Assert.False(result.RegisteredNewUser);
//		}


//		//[Fact]
//		//public async void ExtractFacebookTaggedPlaces()
//		//{
//		//	var geoService = new CountryService();

//		//	var extractor = new FacebookTaggedPlacesExtractor(new FacebookService(), geoService);
//		//	extractor.AccessToken =
//		//		"CAAVlse7iUKoBAJZCwNszsZCvgOR6i36lWCfZCVDkP4taDh2NWsabfZA0XfWqzvWvZAGswJ2MHzCr1xt9KmRQPnUYMbjNvQHRmurE6C8VZBUB3WoG9ZBu7S3m8ql0i9d4Gr9QTo90F3GQeB7PuVQbcVDEHBCj4m7umPgDgHZBNUMvunWsvJOjntspWSvyPt199AsBaErcJIuRZBwZDZD";
//		//	extractor.PortalUser_id = "10202803343824427";

//		//	extractor.ExtractAll();
//		//}



//		//[Fact]
//		//public async void should_login_fb_user()
//		//{
//		//	var fbUser = new FacebookUserAuthenticationDO
//		//	{
//		//		AccessToken =
//		//			"dCAAVlse7iUKoBAJ76BM4cCZABomce0yHqr6rJTUoSOrv6ZCQpRzisazUkOZBzerv2JsHiF73gSwm2zakwZBAuZCOnWlkbahRp5ZBbFm2A7uGpsamQFJbdBYNftFk5ZAaj3cItQsnOXcu0NxUoke8L6bbvG1gJJbYMj7JRrYlDX94ASlKKBCFwCoIekKMX7ujl171h7sKkooIIgZDZD"
//		//	};

//		//	var res = await FBUserDomain.LogInFacebookUser(fbUser);
//		//	var tst = res.ToString();
//		//}


//	}
	
//}