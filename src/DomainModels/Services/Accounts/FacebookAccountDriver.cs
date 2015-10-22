using System;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using Autofac;
using Facebook;
using Gloobster.Common;
using Gloobster.Common.CommonEnums;
using Gloobster.Common.DbEntity;
using Gloobster.Common.DbEntity.PortalUser;
using Gloobster.DomainModels.Services.Places;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.Mappers;
using Gloobster.SocialLogin.Facebook.Communication;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Gloobster.DomainModels.Services.Accounts
{
	public class FacebookAccountDriver : IAccountDriver
	{
		public bool CheckCredintials(object authObject, PortalUserDO portalUser)
		{
			var socAuth = (SocAuthenticationDO) authObject;

			FBService.SetAccessToken(socAuth.AccessToken);
			bool tokenValid = FBService.ValidateToken();
			
			return tokenValid;
		}

		public SocialNetworkType NetworkType => SocialNetworkType.Facebook;

		public IDbOperations DB { get; set; }
		public IFacebookService FBService { get; set; }
		public SocAuthenticationDO Authentication { get; set; }
		public IComponentContext ComponentContext { get; set; }
		public IGeoNamesService GNService { get; set; }
		public ICountryService CountryService { get; set; }
		//public IFriendsDomain FriendsService { get; set; }


		public IPlacesExtractor PlacesExtractor { get; set; }

		public PortalUserDO PortalUser { get; set; }

		public object UserObj { get; set; }

		private FacebookUserFO _fbUser;

		public FacebookUserFO FbUser
		{
			get
			{
				if (_fbUser == null)
				{
					FBService.SetAccessToken(Authentication.AccessToken);
					_fbUser = FBService.Get<FacebookUserFO>("/me");
				}

				return _fbUser;
			}
		}

		public async Task<PortalUserDO> Create()
		{			
			var permTokenResult = IssueNewPermanentAccessToken(Authentication.AccessToken);

			var specifics = new FacebookUserSE
			{
				TimeZone = _fbUser.TimeZone,
				Link = FbUser.Link,
				Locale = FbUser.Locale,
				UpdatedTime = FbUser.UpdatedTime,
				Verified = FbUser.Verified
			};

			if (_fbUser.FavoriteTeams != null)
			{
				specifics.FavoriteTeams = _fbUser.FavoriteTeams.Select(i => i.ToEntity()).ToArray();
			}

			var facebookAccount = new SocialAccountSE
			{
				Authentication = new SocAuthenticationSE
				{
					UserId = Authentication.UserId,
					AccessToken = permTokenResult.AccessToken,
					ExpiresAt = permTokenResult.ExpiresAt

				},
				NetworkType = SocialNetworkType.Facebook,
				Specifics = specifics
			};
			
			var userEntity = new PortalUserEntity
			{
				id = ObjectId.GenerateNewId(),
				DisplayName = FbUser.Name,
                Mail = FbUser.Email,				
				Password = AccountUtils.GeneratePassword(),								
				Languages = ParseLanguages(FbUser.Languages),
				Gender = ParseGender(FbUser.Gender),
				CurrentLocation = await ParseLocationAsync(FbUser.Location),
				HomeLocation = await ParseLocationAsync(FbUser.HomeTown),
				FirstName = FbUser.FirstName,
				LastName = FbUser.LastName,

				ProfileImage = AccountUtils.DownloadAndStoreTheProfilePicture(""),

				SocialAccounts = new[] { facebookAccount }
			};

			var savedEntity = await DB.SaveAsync(userEntity);

			var createdUser = savedEntity.ToDO();
			return createdUser;
		}

		private async Task<CityLocationSE> ParseLocationAsync(IdNameFO location)
		{
			if (location == null)
			{
				return null;
			}

			var prms = location.Name.Split(',');
			bool isValid = prms.Count() == 2;
			if (!isValid)
			{
				return null;
			}
			var cityName = prms[0].Trim();
			var countryName = prms[1].Trim();
			var country = CountryService.GetByCountryName(countryName);
			if (country == null)
			{
				return null;
			}

			var gnResult = await GNService.GetCityAsync(cityName, country.CountryCode, 1);
			if (gnResult.GeoNames.Count() != 1)
			{
				return null;
			}

			var gnCity = gnResult.GeoNames.First();
			var resultLoc = new CityLocationSE
			{
				CountryCode = country.CountryCode,
				City = cityName,
				GeoNamesId = gnCity.GeonameId
			};
			
			return resultLoc;
		}

		private Gender ParseGender(string gender)
		{
			if (gender.ToLower() == "male")
			{
				return Gender.M;
			}

			if (gender.ToLower() == "female")
			{
				return Gender.F;
			}

			return Gender.N;
		}

		private LanguageSE[] ParseLanguages(IdNameFO[] languages)
		{
			if (languages == null)
			{
				return null;
			}

			//todo: implement language reference system

			var langs = languages.Select(l => new LanguageSE {Name = l.Name, LanguageId = 0}).ToArray();
			
			return langs;			
		}
		
		public string GetEmail()
		{
			return FbUser.Email;
		}

		public void OnUserExists(PortalUserDO portalUser)
		{
			UpdateTokenIfNeeded(portalUser);			
		}

		public async void OnUserSuccessfulyLogged(PortalUserDO portalUser)
		{
			PlacesExtractor.Driver = ComponentContext.ResolveKeyed<IPlacesExtractorDriver>("Facebook");

			var fbAcccount = portalUser.GetAccount(SocialNetworkType.Facebook);
			
			await PlacesExtractor.ExtractNewAsync(portalUser.UserId, fbAcccount.Authentication);
			PlacesExtractor.SaveAsync();			
		}
		


		private void UpdateTokenIfNeeded(PortalUserDO portalUser)
		{
			var account = portalUser.SocialAccounts.FirstOrDefault(a => a.NetworkType == SocialNetworkType.Facebook);
			if (account == null)
			{
				return;
			}
			
			//possibly should update all the time. New permissions, etc...
			//bool expired = account.Authentication.ExpiresAt < DateTime.UtcNow;
			//if (expired)
			//{
				var newPermanentToken = IssueNewPermanentAccessToken(account.Authentication.AccessToken);
				UpdateFacebookUserAuth(portalUser, newPermanentToken.AccessToken, newPermanentToken.ExpiresAt);
			//}
		}
		
		public async void UpdateFacebookUserAuth(PortalUserDO portalUser, string accessToken, DateTime expiresAt)
		{
			var portalUserEntity = portalUser.ToEntity();
			var socialAccount = portalUserEntity.SocialAccounts.First(a => a.NetworkType == SocialNetworkType.Facebook);
			socialAccount.Authentication.AccessToken = accessToken;
			socialAccount.Authentication.ExpiresAt = expiresAt;

			var result = await DB.ReplaceOneAsync(portalUserEntity);

			if (result.MatchedCount == 0)
			{
				//todo: make it nice here
				throw new Exception("something went wrong with update");
			}
		}

		private SocAuthenticationDO IssueNewPermanentAccessToken(string accessToken)
		{
			try
			{
				int expireToleranceInSeconds = 60;

				var url =
					$"/oauth/access_token?grant_type=fb_exchange_token&client_id={GloobsterConfig.FacebookAppId}&client_secret={GloobsterConfig.FacebookAppSecret}&fb_exchange_token={accessToken}";

				FBService.SetAccessToken(accessToken);
				var permanentToken = FBService.Get<FacebookPermanentToken>(url);

				var newExpireTime = DateTime.UtcNow.AddSeconds(permanentToken.SecondsToExpire - expireToleranceInSeconds);

				var result = new SocAuthenticationDO
				{
					AccessToken = permanentToken.AccessToken,
					ExpiresAt = newExpireTime
				};

				return result;
			}
			catch (Exception exc)
			{
				throw;
			}
		}
	}
}