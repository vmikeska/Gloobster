using System;
using System.Collections.Generic;
using Gloobster.Database;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.Entities
{
    public class AccountEntity : EntityBase
    {
        public ObjectId User_id { get; set; }
        public string Secret { get; set; }

        public string Password { get; set; }
        public string Mail { get; set; }

        public bool EmailSent { get; set; }
        public bool EmailConfirmed { get; set; }
    }

    public class AccessLogEntity : EntityBase
    {
        public ObjectId User_id { get; set; }
        public string IP { get; set; }
        public string UserAgent { get; set; }
        public DateTime Time { get; set; }
        //more ?
    }

    public class SocialAccountEntity : EntityBase
    {
        public ObjectId User_id { get; set; }
        public SocialNetworkType NetworkType { get; set; }

        public bool HasPermanentToken { get; set; }
        public string ErrorMessage { get; set; }

        public string AccessToken { get; set; }
        public string TokenSecret { get; set; }
        public string UserId { get; set; }
        public DateTime ExpiresAt { get; set; }        
    }






    public class SocialAccountSE
    {
        public SocialNetworkType NetworkType { get; set; }

        public SpecificsUserBase Specifics { get; set; }

        public SocAuthenticationSE Authentication { get; set; }
    }

    public class UserEntity : EntityBase
    {
        public ObjectId User_id { get; set; }

        public string Mail { get; set; }

        public string DisplayName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool HasProfileImage { get; set; }

        public CityLocationSE HomeLocation { get; set; }
        public CityLocationSE CurrentLocation { get; set; }
        public List<string> Languages { get; set; }

        public Gender Gender { get; set; }

        
        public List<AirportSaveSE> HomeAirports { get; set; }

        //+age, birth day ? At least Age
        //
    }
}