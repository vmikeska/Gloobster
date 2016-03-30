using System;
using System.Collections.Generic;
using System.Linq;
using Gloobster.Enums;

namespace Gloobster.DomainObjects
{
	public class UserDO
	{
		public string UserId { get; set; }
		public string DisplayName { get; set; }
		//public string Password { get; set; }
		public string Mail { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }

        public bool HasProfileImage { get; set; }

        public CityLocationDO HomeLocation { get; set; }
		public CityLocationDO CurrentLocation { get; set; }
		public List<string> Languages { get; set; }

		public Gender Gender { get; set; }

		//public SocialAccountDO[] SocialAccounts { get; set; }

		//public SocialAccountDO GetAccount(SocialNetworkType networkType)
		//{
		//	if (SocialAccounts == null)
		//	{
		//		return null;
		//	}

		//	if (!SocialAccounts.Any())
		//	{
		//		return null;
		//	}

		//	var account = SocialAccounts.FirstOrDefault(a => a.NetworkType == networkType);
		//	return account;
		//}
	}

	public class SocialAccountDO
	{		
		public SocialNetworkType NetworkType { get; set; }

		public object Specifics { get; set; }

		public SocAuthenticationDO Authentication { get; set; }
	}

    //remove ?
	public class SocAuthenticationDO
	{
		public string AccessToken { get; set; }
		public string TokenSecret { get; set; }
		public string UserId { get; set; }
		public DateTime ExpiresAt { get; set; }
	}

    //remove ?
	public class LanguageDO
	{
		public string Name { get; set; }
		public int LanguageId { get; set; }
	}

	public class CityLocationDO
	{
		public string City { get; set; }
		public string CountryCode { get; set; }
		public int GeoNamesId { get; set; }
	}


}