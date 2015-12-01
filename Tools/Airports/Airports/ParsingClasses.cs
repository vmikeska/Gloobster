using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Airports
{
	public class Airport
	{
		public int OrigId { get; set; }

		public string Name { get; set; }

		public string City { get; set; }

		//public string Country { get; set; }
		public string CountryCode { get; set; }

		public string IataFaa { get; set; }

		public string Icao { get; set; }

		public LatLng Coord { get; set; }

		public int Alt { get; set; }

		//public string Timezone { get; set; }

		//public string DST { get; set; }

		//public string TzTimezone { get; set; }

		public int GeoNamesId { get; set; }

		public int IncomingFlights { get; set; }
	}

	public class LatLng
	{
		public double Lat { get; set; }
		public double Lng { get; set; }
	}

	public class AirportRow
	{
		/// <summary>
		/// Unique OpenFlights identifier for this airport
		/// </summary>
		public string AirportId { get; set; }
		/// <summary>
		/// Name of airport. May or may not contain the City name
		/// </summary>
		public string Name { get; set; }
		/// <summary>
		/// Main city served by airport. May be spelled differently from Name
		/// </summary>
		public string City { get; set; }
		/// <summary>
		/// Country or territory where airport is located
		/// </summary>
		public string Country { get; set; }
		/// <summary>
		/// 3-letter FAA code, for airports located in Country "United States of America".
		///3-letter IATA code, for all other airports.
		///Blank if not assigned.
		/// </summary>
		public string IataFaa { get; set; }
		/// <summary>
		/// 4-letter ICAO code.
		/// Blank if not assigned.
		/// </summary>
		public string ICAO { get; set; }
		/// <summary>
		/// Decimal degrees, usually to six significant digits. Negative is South, positive is North
		/// </summary>
		public string Latitude { get; set; }
		/// <summary>
		/// Decimal degrees, usually to six significant digits. Negative is West, positive is East
		/// </summary>
		public string Longitude { get; set; }
		/// <summary>
		/// In feet
		/// </summary>
		public string Altitude { get; set; }
		/// <summary>
		/// Hours offset from UTC. Fractional hours are expressed as decimals, eg. India is 5.5
		/// </summary>
		public string Timezone { get; set; }
		/// <summary>
		/// Daylight savings time. One of E (Europe), A (US/Canada), S (South America), O (Australia), Z (New Zealand), N (None) or U (Unknown)
		/// </summary>
		public string DST { get; set; }
		/// <summary>
		/// Timezone in "tz" (Olson) format, eg. "America/Los_Angeles"
		/// </summary>
		public string TzTimezone { get; set; }
	}

	[DataContract]
	public class CountriesRoot
	{
		[DataMember(Name = "countries")]
		public List<Country> Countries { get; set; }
	}

	[DataContract]
	public class Country
	{
		[DataMember(Name = "countryCode")]
		public string CountryCode { get; set; }
		[DataMember(Name = "countryName")]
		public string CountryName { get; set; }
		[DataMember(Name = "isoAlpha3")]
		public string IsoAlpha3 { get; set; }
	}
}
