using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.Mappers;
using MongoDB.Bson;
using TweetSharp;

namespace Gloobster.DomainModels.Services.Accounts
{
	public class TwitterAccountDriver : IAccountDriver
	{
		public IDbOperations DB { get; set; }
		public PortalUserDO PortalUser { get; set; }
		public TwitterService TwitterSvc { get; set; }


		public TwitterAccountDriver()
		{
			TwitterSvc = new TwitterService(GloobsterConfig.TwitterConsumerKey, GloobsterConfig.TwitterConsumerSecret);
		}

		public async Task<PortalUserDO> Create(object authObj)
		{
			var auth = GetTypedUser(authObj);

			TwitterSvc.AuthenticateWith(auth.Token, auth.TokenSecret);

			TwitterUser user = TwitterSvc.VerifyCredentials(new VerifyCredentialsOptions { IncludeEntities = true });
			
			//todo: make additional step to provide email
			var email = "twitter";

			var userEntity = new PortalUserEntity
			{
				id = ObjectId.GenerateNewId(),
				DisplayName = user.ScreenName,
				Mail = email,
				Password = AccountUtils.GeneratePassword(),
				Twitter = new TwitterGroupEntity
				{
					TwitterUser = user.ToEntity(),
					Authentication = auth.ToEntity()
				}
			};

			var savedEntity = await DB.SaveAsync(userEntity);

			var createdUser = savedEntity.ToDO();
			return createdUser;
		}

		public async Task<PortalUserDO> Load(object userObj)
		{
			var user = GetTypedUser(userObj);

			var query = $"{{ 'Twitter.TwUserId': '{user.TwUserId}' }}";
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
			return "unique";
		}

		public void OnUserExists(PortalUserDO portalUser)
		{
			
		}

		public void OnUserSuccessfulyLogged(PortalUserDO portalUser)
		{
			var extractor = new TwitterPlacesExtractor();
			extractor.Extract(portalUser.Twitter.Authentication);
		}


		private TwitterUserAuthenticationDO GetTypedUser(object user)
		{
			var auth = (TwitterUserAuthenticationDO)user;
			return auth;
		}
	}
}