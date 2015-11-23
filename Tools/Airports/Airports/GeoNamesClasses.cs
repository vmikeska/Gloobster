using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace Airports
{
	[DataContract]
	public class CitySearchResponse : GeoNamesResponseBase
	{
		[DataMember(Name = "totalResultsCount")]
		public int TotalResultsCount { get; set; }
		[DataMember(Name = "geonames")]
		public List<GeoName> GeoNames { get; set; }
	}

	[DataContract]
	public class GeoNamesResponseBase
	{
		[DataMember(Name = "status")]
		public ResponseStatus Status { get; set; }

		public bool IsSuccessful => Status != null;
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
}
