using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Gloobster.DomainObjects.BaseClasses
{
	[DataContract]
	public class GeoNamesResponseBase
	{
		[DataMember(Name = "status")]
		public ResponseStatus Status { get; set; }

		public bool IsSuccessful => Status != null;
	}

	[DataContract]
	public class CitySearchResponse: GeoNamesResponseBase
	{
		[DataMember(Name = "totalResultsCount")]
		public int TotalResultsCount { get; set; }
		[DataMember(Name = "geonames")]
		public List<GeoName> GeoNames { get; set; }
	}

	[DataContract]
	public class ResponseStatus
	{
		[DataMember(Name = "message")]
		public string Message { get; set; }
		[DataMember(Name = "value")]
		public int Value { get; set; }
	}

	[DataContract]
	public class GeoName
	{
		[DataMember(Name = "countryId")]
		public string CountryId { get; set; }
		[DataMember(Name = "adminCode1")]
		public string AdminCode1 { get; set; }
		[DataMember(Name = "countryName")]
		public string CountryName { get; set; }
		[DataMember(Name = "fclName")]
		public string FclName { get; set; }
		[DataMember(Name = "countryCode")]
		public string CountryCode { get; set; }
		[DataMember(Name = "lng")]
		public float Longitude { get; set; }
		[DataMember(Name = "fcodeName")]
		public string FCodeName { get; set; }
		[DataMember(Name = "toponymName")]
		public string ToponymName { get; set; }
		[DataMember(Name = "fcl")]
		public string Fcl { get; set; }
		[DataMember(Name = "name")]
		public string Name { get; set; }
		[DataMember(Name = "fcode")]
		public string FCode { get; set; }
		[DataMember(Name = "geonameId")]
		public int GeonameId { get; set; }
		[DataMember(Name = "lat")]
		public float Latitude { get; set; }
		[DataMember(Name = "adminName1")]
		public string AdminName1 { get; set; }
		[DataMember(Name = "population")]
		public int Population { get; set; }
	}

	[DataContract]
	public class Timezone
	{
		[DataMember(Name = "dstOffset")]
		public int DstOffset { get; set; }
		[DataMember(Name = "gmtOffset")]
		public int GmtOffset { get; set; }
		[DataMember(Name = "timeZoneId")]
		public string TimeZoneId { get; set; }
	}

	[DataContract]
	public class AlternateName
	{
		[DataMember(Name = "name")]
		public string Name { get; set; }
		[DataMember(Name = "lang")]
		public string Lang { get; set; }
	}

	[DataContract]
	public class Bbox
	{
		[DataMember(Name = "south")]
		public double South { get; set; }
		[DataMember(Name = "east")]
		public double East { get; set; }
		[DataMember(Name = "north")]
		public double North { get; set; }
		[DataMember(Name = "west")]
		public double West { get; set; }
	}

	[DataContract]
	public class GeoNameIdResponse
	{
		[DataMember(Name = "adminCode2")]
		public string AdminCode2 { get; set; }
		[DataMember(Name = "alternateNames")]
		public List<AlternateName> AlternateNames { get; set; }
		[DataMember(Name = "countryName")]
		public string CountryName { get; set; }
		[DataMember(Name = "adminCode1")]
		public string AdminCode1 { get; set; }
		[DataMember(Name = "lng")]
		public float Lng { get; set; }
		[DataMember(Name = "adminName2")]
		public string AdminName2 { get; set; }
		[DataMember(Name = "fcodeName")]
		public string FcodeName { get; set; }
		[DataMember(Name = "adminName3")]
		public string AdminName3 { get; set; }
		[DataMember(Name = "timezone")]
		public Timezone Timezone { get; set; }
		[DataMember(Name = "adminName4")]
		public string AdminName4 { get; set; }
		[DataMember(Name = "adminName5")]
		public string AdminName5 { get; set; }
		[DataMember(Name = "bbox")]
		public Bbox Bbox { get; set; }
		[DataMember(Name = "name")]
		public string Name { get; set; }
		[DataMember(Name = "fcode")]
		public string Fcode { get; set; }
		[DataMember(Name = "geonameId")]
		public int GeonameId { get; set; }
		[DataMember(Name = "asciiName")]
		public string AsciiName { get; set; }
		[DataMember(Name = "lat")]
		public float Lat { get; set; }
		[DataMember(Name = "population")]
		public int Population { get; set; }
		[DataMember(Name = "adminName1")]
		public string AdminName1 { get; set; }
		[DataMember(Name = "adminId1")]
		public string AdminId1 { get; set; }
		[DataMember(Name = "countryId")]
		public string CountryId { get; set; }
		[DataMember(Name = "fclName")]
		public string FclName { get; set; }
		[DataMember(Name = "countryCode")]
		public string CountryCode { get; set; }
		[DataMember(Name = "srtm3")]
		public int Srtm3 { get; set; }
		[DataMember(Name = "adminId2")]
		public string AdminId2 { get; set; }
		[DataMember(Name = "wikipediaURL")]
		public string WikipediaUrl { get; set; }
		[DataMember(Name = "toponymName")]
		public string ToponymName { get; set; }
		[DataMember(Name = "fcl")]
		public string Fcl { get; set; }
		[DataMember(Name = "continentCode")]
		public string ContinentCode { get; set; }
	}
}