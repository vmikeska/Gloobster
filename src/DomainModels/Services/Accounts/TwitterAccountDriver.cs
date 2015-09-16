using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.Mappers;
using MongoDB.Bson;

namespace Gloobster.DomainModels.Services.Accounts
{
	public class TwitterAccountDriver : IAccountDriver
	{
		public IDbOperations DB { get; set; }
		public PortalUserDO PortalUser { get; set; }
		public async Task<PortalUserDO> Create(object userObj)
		{
			var user = GetTypedUser(userObj);

			//todo: make additional step to provide email
			var email = "twitter";

			var userEntity = new PortalUserEntity
			{
				id = ObjectId.GenerateNewId(),
				DisplayName = user.ScreenName,
				Mail = email,
				Password = AccountUtils.GeneratePassword(),
				Twitter = user.ToEntity()
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
			
		}


		private TwitterUserDO GetTypedUser(object user)
		{
			var auth = (TwitterUserDO)user;
			return auth;
		}
	}
}