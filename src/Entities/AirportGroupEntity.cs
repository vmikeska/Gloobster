using System.Collections.Generic;
using Gloobster.Common;
using Gloobster.Database;

namespace Gloobster.Entities
{
	public class AirportGroupEntity : EntityBase
	{
		public List<int> AirportIds { get; set; }
		public string City { get; set; }
		public string CountryCode { get; set; }
		public int GID { get; set; }
		public LatLng Coord { get; set; }
		//public MongoPoint CityCoord { get; set; }
		public int Population { get; set; }
	}
}