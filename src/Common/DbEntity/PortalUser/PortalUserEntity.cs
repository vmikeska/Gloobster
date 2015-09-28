using System;
using Gloobster.Common.CommonEnums;

namespace Gloobster.Common.DbEntity.PortalUser
{    

	public class PortalUserEntity : EntityBase
	{
		public string DisplayName { get; set; }
		public string Password { get; set; }
		public string Mail { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string ProfileImage { get; set; }

		public CityLocationSE HomeLocation { get; set; }
		public CityLocationSE CurrentLocation { get; set; }
		public LanguageSE[] Languages { get; set; }
		
		public Gender Gender { get; set; }

		public SocialAccountSE[] SocialAccounts { get; set; }		
	}

	
}
