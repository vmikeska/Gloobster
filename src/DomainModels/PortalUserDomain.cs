using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
using System;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Newtonsoft.Json.Linq;

namespace Gloobster.DomainModels
{
	public class PortalUserDomain : IPortalUserDomain
    {
        public IDbOperations DB;
		public IFacebookUserDomain FbUserDomain; 

        public PortalUserDomain(IDbOperations db, IFacebookUserDomain fbUserDomain)
        {
            DB = db;
	        FbUserDomain = fbUserDomain;
        }

		public async Task<UserLoggedResultDO> ValidateOrCreateUser(PortalUserDO portalUser)
		{
			UserLoggedResultDO result = null;

			bool isFromFacebook = portalUser.Facebook?.Authentication != null;
			bool isFromTwitter = false;
			bool isFromFoursquare = false;

			if (isFromFacebook)
			{
				result = await FbUserDomain.ValidateFacebookUser(portalUser.Facebook.Authentication);
				
			}
			else if (isFromTwitter)
			{
				result = new UserLoggedResultDO();
			}
			else if (isFromFoursquare)
			{
				result = new UserLoggedResultDO();
			}
			//is standart user
			else
			{
				result = new UserLoggedResultDO();
			}

			//todo: should it be here ?
			if (result.Status == UserLogged.Successful)
			{
				//since here user is valid, lets create the token
				var tokenObj = new AuthorizationToken(result.UserId);
				var tokenStr = Newtonsoft.Json.JsonConvert.SerializeObject(tokenObj);
				var tokenJson = JObject.Parse(tokenStr);

				result.EncodedToken = JsonWebToken.Encode(tokenJson, GloobsterConfig.AppSecret, JwtHashAlgorithm.RS256);
			}


			return result;
		}
		
		public async Task<UserCreatedResultDO> CreateUserBase(PortalUserDO user)
        {
            bool userExists = await UserExists(user.Mail);
            if (userExists)
            {
                return new UserCreatedResultDO {State = UserCreatedState.AlreadyExists};
            }

            var newUser = new PortalUserEntity
            {
                Mail = user.Mail,
                Password = user.Password,
				DisplayName = user.DisplayName
            };

            var userEntity = await DB.SaveAsync(newUser);
            var result = new UserCreatedResultDO {Entity = userEntity, State = UserCreatedState.Created};
            return result;
        }
		
        public async Task<bool> UserExists(string mail)
        {
            var query = string.Format("{{'Mail': '{0}'}}", mail);
            long results = await DB.GetCount<PortalUserEntity>(query);

            bool exists = results > 0;
            return exists;
        }		
	}
}
