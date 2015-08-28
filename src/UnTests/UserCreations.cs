using System.Threading.Tasks;
using Gloobster.Common.DbEntity;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.SocialLogin.Facebook.Communication;
using MongoDB.Bson;

namespace Gloobster.UnitTests
{
	public class UserCreations: CreationsBase
	{
		static UserCreations()
		{
			FavoriteTeams1 = new[] { new IdNameFO { Id = "444", Name = "Ein" }, new IdNameFO { Id = "555", Name = "Ein2" }};
			Languages1 = new[] { new IdNameFO { Id = "55", Name = "English" }, new IdNameFO { Id = "66", Name = "German" } };
			HomeTown1 = new IdNameFO {Id = "22", Name = "Frankfurt, Germany"};
			Location1 = new IdNameFO {Id = "96", Name = "Prague, Czech republic"};
		}

		public const string DisplayName1 = "Jan Tester";
		public const string Mail1 = "tester@tester.com";
		public const string Password1 = "Tester";

		public const string AccessToken1 = "token";
		public const int ExpiresIn1 = 1111;
		public const string SignedRequest1 = "asdf";
		public const string UserId1 = "123";

		public const string Id1 = UserId1;
		public const string Email1 = Mail1;
		public const string FirstName1 = "Vac";
		public const string LastName1 = "Mik";
		public const string Gender1 = "male";
		public const string Link1 = "aLink";
		public const string Locale1 = "aLocale";
		public const string Name1 = "Vac Mik";
		public const int TimeZone1 = 1;
		public const bool Verified1 = true;
		public const string UpdatedTime1 = "aTime";
		public static IdNameFO[] FavoriteTeams1;
		public static IdNameFO HomeTown1;
		public static IdNameFO[] Languages1;
		public static IdNameFO Location1;


		public static FacebookGroupEntity CreateFacebookGroupEntity1()
		{
			var entity = new FacebookGroupEntity
			{
				Authentication = CreateFacebookUserAuthenticationEntity1(),
				FacebookUser = CreateFacebookUserEntity1()
			};

			return entity;
		}

		public static FacebookUserAuthenticationEntity CreateFacebookUserAuthenticationEntity1()
		{
			var fbUserEntity = new FacebookUserAuthenticationEntity
			{
				AccessToken = AccessToken1,
				ExpiresIn = ExpiresIn1,
				SignedRequest = SignedRequest1,
				UserId = UserId1
			};
			
			return fbUserEntity;
		}

		public static FacebookUserAuthenticationDO CreateFacebookUserAuthenticationDO()
		{
			var fbUserEntity = new FacebookUserAuthenticationDO
			{
				AccessToken = AccessToken1,
				ExpiresIn = ExpiresIn1,
				SignedRequest = SignedRequest1,
				UserID = UserId1
			};

			return fbUserEntity;
		}

		public async static Task<PortalUserEntity> CreatePortalUserEntity1(bool withFacebook = false, bool save = true)
		{
			var user = new PortalUserEntity
			{
				id = ObjectId.GenerateNewId(),
				DisplayName = DisplayName1,
				Mail = Mail1,
				Password = Password1
			};

			if (withFacebook)
			{
				user.Facebook = CreateFacebookGroupEntity1();
			}

			if (save)
			{
				user = await DB.SaveAsync(user);
			}

			return user;
		}

		public static PortalUserDO CreatePortalUserDO1(bool withFacebook = false)
		{
			var user = new PortalUserDO
			{
				DisplayName = DisplayName1,
				Mail = Mail1,
				Password = Password1
			};

			if (withFacebook)
			{
				user.Facebook = CreateFacebookGroupDO1();
			}						

			return user;
		}

		public static FacebookGroupDO CreateFacebookGroupDO1()
		{
			var entity = new FacebookGroupDO
			{
				Authentication = CreateFacebookUserDO1()				
			};

			return entity;
		}

		public static FacebookUserAuthenticationDO CreateFacebookUserDO1()
		{
			var fbUser = new FacebookUserAuthenticationDO
			{
				AccessToken = AccessToken1,
				ExpiresIn = ExpiresIn1,
				SignedRequest = SignedRequest1,
				UserID = UserId1
			};
			return fbUser;
		}

		public static FacebookUserFO CreateFacebookUserFO1()
		{
			var fbUser = new FacebookUserFO
			{
				Name = Name1,
				Id = Id1,
				Languages = Languages1,
				Location = Location1,
				HomeTown = HomeTown1,
				Email = Email1,
				Gender = Gender1,
				FirstName = FirstName1,
				TimeZone = TimeZone1,
				Verified = Verified1,
				Locale = Locale1,
				Link = Link1,
				UpdatedTime = UpdatedTime1,
				FavoriteTeams = FavoriteTeams1,
				LastName = LastName1
			};
			return fbUser;
		}

		public static FacebookUserEntity CreateFacebookUserEntity1()
		{
			var fbUser = new FacebookUserEntity
			{
				Name = Name1,
				UserId = Id1,
				//todo: fix these
				//Languages = Languages1,
				//Location = Location1,
				//HomeTown = HomeTown1,
				Email = Email1,
				Gender = Gender1,
				FirstName = FirstName1,
				TimeZone = TimeZone1,
				Verified = Verified1,
				Locale = Locale1,
				Link = Link1,
				UpdatedTime = UpdatedTime1,
				//FavoriteTeams = FavoriteTeams1,
				LastName = LastName1
			};
			return fbUser;
		}
	}
}