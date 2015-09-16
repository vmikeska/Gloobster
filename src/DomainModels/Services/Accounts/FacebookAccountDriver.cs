using System;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
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
		public IDbOperations DB { get; set; }
		public IFacebookService FBService;
		public IFacebookDomain FBDomain;

		public PortalUserDO PortalUser { get; set; }

		public async Task<PortalUserDO> Create(object user)
		{
			FacebookUserAuthenticationDO auth = GetTypedUser(user);
			var permenentToken = IssueNewPermanentAccessToken(auth.AccessToken);

			FBService.SetAccessToken(auth.AccessToken);
			var userCallResult = FBService.Get<FacebookUserFO>("/me");
			var resultEntity = userCallResult.ToEntity();

			var userEntity = new PortalUserEntity
			{
				id = ObjectId.GenerateNewId(),
				DisplayName = resultEntity.Name,
				Mail = resultEntity.Email,
				Password = AccountUtils.GeneratePassword(),
				Facebook = new FacebookGroupEntity
				{
					Authentication = new FacebookUserAuthenticationEntity
					{
						AccessToken = permenentToken.AccessToken,
						ExpiresAt = permenentToken.ExpiresAt,
						UserId = auth.UserId
					},
					FacebookUser = resultEntity
				}
			};

			var savedEntity = await DB.SaveAsync(userEntity);

			var createdUser = savedEntity.ToDO();
			return createdUser;
		}

		public async Task<PortalUserDO> Load(object user)
		{
			FacebookUserAuthenticationDO auth = GetTypedUser(user);

			var query = $"{{ 'Facebook.FacebookUser.UserId': '{auth.UserId}' }}";
			var results = await DB.FindAsync<PortalUserEntity>(query);

			if (!results.Any())
			{
				return null;
			}

			var result = results.First().ToDO();
			return result;
		}

		public string GetEmail(object user)
		{
			//todo: implement
			return "unique";
		}

		public void OnUserExists(PortalUserDO portalUser)
		{
			UpdateTokenIfNeeded(portalUser);			
		}

		public void OnUserSuccessfulyLogged(PortalUserDO portalUser)
		{
			var fb = portalUser.Facebook;
			FBDomain.UpdateVisitedPlaces(fb.FacebookUser.Id, portalUser.DbUserId, fb.Authentication.AccessToken);
		}
		


		private void UpdateTokenIfNeeded(PortalUserDO portalUser)
		{
			bool expired = portalUser.Facebook.Authentication.ExpiresAt < DateTime.UtcNow;
			if (expired)
			{
				var newPermanentToken = IssueNewPermanentAccessToken(portalUser.Facebook.Authentication.AccessToken);
				UpdateFacebookUserAuth(portalUser.DbUserId, newPermanentToken.AccessToken, newPermanentToken.ExpiresAt);
			}
		}

		private async void UpdateFacebookUserAuth(string dbUserId, string accessToken, DateTime expiresAt)
		{
			var filter = Builders<BsonDocument>.Filter.Eq("_id", new ObjectId(dbUserId));
			var update = Builders<BsonDocument>.Update
				.Set("Facebook.Authentication.AccessToken", accessToken)
				.Set("Facebook.Authentication.ExpiresAt", expiresAt);

			//todo: remove ExpiresIn at all
			var result = await DB.UpdateAsync<PortalUserEntity>(update, filter);

			if (result.MatchedCount == 0)
			{
				//todo: make it nice here
				throw new Exception("something went wrong with update");
			}
		}

		private FacebookUserAuthenticationDO GetTypedUser(object user)
		{
			var auth = (FacebookUserAuthenticationDO)user;
			return auth;
		}

		private FacebookUserAuthenticationDO IssueNewPermanentAccessToken(string accessToken)
		{
			int expireToleranceInSeconds = 60;

			var url =
				string.Format("/oauth/access_token?grant_type=fb_exchange_token&client_id={0}&client_secret={1}&fb_exchange_token={2}",
					GloobsterConfig.FacebookAppId, GloobsterConfig.FacebookAppSecret, accessToken);

			FBService.SetAccessToken(accessToken);
			var permanentToken = FBService.Get<FacebookPermanentToken>(url);

			var newExpireTime = DateTime.UtcNow.AddSeconds(permanentToken.SecondsToExpire - expireToleranceInSeconds);

			var result = new FacebookUserAuthenticationDO
			{
				AccessToken = permanentToken.AccessToken,
				ExpiresAt = newExpireTime
			};

			return result;
		}
	}
}