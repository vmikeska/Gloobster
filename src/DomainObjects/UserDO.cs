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
		public string Mail { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }

        public bool HasProfileImage { get; set; }

        public CityLocationDO HomeLocation { get; set; }
		public CityLocationDO CurrentLocation { get; set; }
		public List<string> Languages { get; set; }
        public string DefaultLang { get; set; }

        public Gender Gender { get; set; }
	}
    
    public class CityLocationDO
	{
		public string City { get; set; }
		public string CountryCode { get; set; }
		public int GeoNamesId { get; set; }
	}


}