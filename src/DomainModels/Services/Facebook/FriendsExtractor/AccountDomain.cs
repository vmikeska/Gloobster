using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Enums;
using MongoDB.Bson;

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

            var auth = new SocAuthDO
            {
                UserId = authEntity.UserId,
                TokenSecret = authEntity.TokenSecret,
                AccessToken = authEntity.AccessToken,
                ExpiresAt = authEntity.ExpiresAt,
                SocUserId = authEntity.UserId,
                NetType = authEntity.NetworkType,
                ErrorMessage = authEntity.ErrorMessage,
                HasPermanentToken = authEntity.HasPermanentToken
            };

            return auth;
        }
    }
}