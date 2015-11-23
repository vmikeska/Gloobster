using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace CordinatestConvert
{
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
