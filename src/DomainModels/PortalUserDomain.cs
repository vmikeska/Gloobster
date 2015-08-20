using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
using Gloobster.DomainModelsCommon.User;
using System.Linq;
using Gloobster.Mappers;

namespace Gloobster.DomainModels
{
	public class PortalUserDomain : IPortalUserDomain
    {
        public IDbOperations DB;

        public PortalUserDomain(IDbOperations db)
        {
            DB = db;
        }

        public PortalUserDomain() { }

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

		

		public async Task<FacebookUserExistsDO> FacebookUserExists(FacebookUserDO facebookUser)
		{
			//todo: write query
			var query = string.Format("{{'Mail': '{0}'}}", facebookUser.UserID);
			var results = await DB.FindAsync<PortalUserEntity>(query);

			bool exist = (results != null && results.Any());

			var result = new FacebookUserExistsDO
			{
				UserExists = exist
			};
			
            if (exist)
			{
				result.PortalUser = results.First().ToDO();
			}

			return result;			
        }

		public void CreateFacebookUser(FacebookUserDO facebookUser)
		{
			//todo: check on existance of userId in the system.

			//call the ME

			//check if email exists in the system already

			//generate the name, check if is unique/
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
