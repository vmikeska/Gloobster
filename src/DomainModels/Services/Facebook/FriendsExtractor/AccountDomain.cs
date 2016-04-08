using System.Collections.Generic;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Mappers;
using MongoDB.Bson;
using System.Linq;

namespace Gloobster.DomainModels.Services.Facebook.FriendsExtractor
{
    public class AccountDomain : IAccountDomain
    {
        public IDbOperations DB { get; set; }

        public SocAuthDO GetAuth(SocialNetworkType netType, string userId)
        {
            var userIdObj = new ObjectId(userId);

            var authEntity = DB.FOD<SocialAccountEntity>(e => e.User_id == userIdObj && e.NetworkType == netType);
            if (authEntity == null)
            {
                return null;
            }

            var auth = authEntity.ToDO();

            return auth;
        }

        public List<SocAuthDO> GetAuths(string userId)
        {
            var userIdObj = new ObjectId(userId);

            var authsEntity = DB.List<SocialAccountEntity>(e => e.User_id == userIdObj);

            var res = authsEntity.Select(e => e.ToDO()).ToList();
            return res;
        }
    }
}