using System.Linq;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
using Gloobster.DomainModels.Services.Places;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.Mappers;
using MongoDB.Bson;
using TweetSharp;

namespace Gloobster.DomainModels.Services.Accounts
{
	public class TwitterAccountDriver : IAccountDriver
	{
		public IComponentContext ComponentContext { get; set; }
		public IDbOperations DB { get; set; }
		public PortalUserDO PortalUser { get; set; }
		public TwitterService TwitterSvc { get; set; }

		public object UserObj { get; set; }
		private TwitterUserAuthenticationDO User => (TwitterUserAuthenticationDO)UserObj;

		public IPlacesExtractor PlacesExtractor { get; set; }

		public TwitterAccountDriver()
		{
			TwitterSvc = new TwitterService(GloobsterConfig.TwitterConsumerKey, GloobsterConfig.TwitterConsumerSecret);
		}



		public async Task<PortalUserDO> Create()
		{
			TwitterSvc.AuthenticateWith(User.Token, User.TokenSecret);

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
					Authentication = User.ToEntity()
				}
			};

			var savedEntity = await DB.SaveAsync(userEntity);

			var createdUser = savedEntity.ToDO();
			return createdUser;
		}

		public async Task<PortalUserDO> Load()
		{
			var query = $"{{ 'Twitter.TwitterUser.TwUserId': {User.TwUserId} }}";
			var results = await DB.FindAsync<PortalUserEntity>(query);

			if (!results.Any())
			{
				return null;
			}

			var result = results.First().ToDO();
			return result;

		}

		public string GetEmail()
		{
			return "unique";
		}

		public void OnUserExists(PortalUserDO portalUser)
		{
			
		}

		public async void OnUserSuccessfulyLogged(PortalUserDO portalUser)
		{
			PlacesExtractor.Driver = ComponentContext.ResolveKeyed<IPlacesExtractorDriver>("Twitter");

			await PlacesExtractor.ExtractNewAsync(portalUser.DbUserId, portalUser.Twitter.Authentication);
			PlacesExtractor.SaveAsync();
		}
	}
}