using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
using Gloobster.DomainModelsCommon.User;

namespace Goobster.Portal.DomainModels
{
    public class PortalUserDomain : IPortalUserDomain
    {
        public IDbOperations DB;

        public PortalUserDomain(IDbOperations db)
        {
            DB = db;
        }

        public PortalUserDomain() { }

        public async Task<UserCreatedResultDO> CreateUserBase(string mail, string password)
        {
            bool userExists = await UserExists(mail);
            if (userExists)
            {
                return new UserCreatedResultDO {State = UserCreatedState.AlreadyExists};
            }

            var newUser = new PortalUserEntity
            {
                Mail = mail,
                Password = password
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
