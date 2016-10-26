using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.DomainObjects;
using Gloobster.DomainObjects.BaseClasses;

namespace Gloobster.DomainInterfaces
{
	public interface IGeoNamesService
	{
		//Task<CitySearchResponse> GetCityAsync(string cityName, string countryCode, int maxRows);
		//Task<T> GetResponseAsync<T>(QueryBuilder queryBuilder) where T : new();
		//Task<CitySearchResponse> GetCityQueryAsync(string query, int maxRows);
		//Task<GeoNameIdResponse> GetCityByIdAsync(long id);
		//CityDO GetCityById(long id);

		Task<CityDO> GetCityByIdAsync(int id);
		Task<List<CityDO>> GetCityAsync(string cityName, string countryCode, int maxRows);
		Task<List<CityDO>> GetCityQueryAsync(string query, int maxRows);
	    Task<List<CityDO>> GetCityByPopulation(int minPopulation);

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