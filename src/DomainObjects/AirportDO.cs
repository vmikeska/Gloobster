using Gloobster.Common;

namespace Gloobster.DomainObjects
{
	public class AirportDO
	{
		public int OrigId { get; set; }
		public string Name { get; set; }

		public string City { get; set; }

		public string CountryCode { get; set; }

		public int GeoNamesId { get; set; }

		public string IataFaa { get; set; }

		public string Icao { get; set; }

		public LatLng Coord { get; set; }

		public int Alt { get; set; }
	}
}