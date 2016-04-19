using System;
using Gloobster.Enums;

namespace Gloobster.DomainObjects
{
    public class SocAuthDO
    {
        public string UserId { get; set; }
        public string AccessToken { get; set; }
        public string TokenSecret { get; set; }
        public string SocUserId { get; set; }
        public DateTime ExpiresAt { get; set; }
        public SocialNetworkType NetType { get; set; }
        public string Other { get; set; }
        
        public bool HasPermanentToken { get; set; }
        public string ErrorMessage { get; set; }        
    }

    public class LoginResponseDO
    {
        public string UserId { get; set; }
        public string DisplayName { get; set; }
        public string Token { get; set; }
        public SocialNetworkType NetType { get; set; }
        public string SocToken { get; set; }
        public bool FullRegistration { get; set; }

        public bool AccountAlreadyInUse { get; set; }
        public bool Successful { get; set; }
    }

    public class PermanentTokenDO
    {
        public string AccessToken { get; set; }
        public string PermanentAccessToken { get; set; }
        public DateTime NewExpireAt { get; set; }
        public string Message { get; set; }
        public bool Issued { get; set; }
    }
}