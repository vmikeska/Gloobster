using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
using System;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;

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
			bool isFromFacebook = portalUser.Facebook?.Authentication != null;
			bool isFromTwitter = false;
			bool isFromFoursquare = false;

			if (isFromFacebook)
			{
				UserLoggedResultDO res = await FbUserDomain.ValidateFacebookUser(portalUser.Facebook.Authentication);
				return res;
			}
			else if (isFromTwitter)
			{

			}
			else if (isFromFoursquare)
			{
			}
			//is standart user
			else
			{
				
			}

			return null;
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
