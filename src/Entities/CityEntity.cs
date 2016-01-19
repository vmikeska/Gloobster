using System;
using Gloobster.Common;
using Gloobster.Database;

namespace Gloobster.Entities
{	
	public class CityEntity : EntityBase
	{
		public int GID { get; set; }
		public string Name { get; set; }
		public string AsciiName { get; set; }
		public string AlternateNames { get; set; }
		public LatLng Coordinates { get; set; }
		public string CountryCode { get; set; }
		public string AlternateCountryCode { get; set; }
		public int Population { get; set; }
		public string Elevation { get; set; }
		public string TimeZone { get; set; }
        public string UsState { get; set; }
	}
}