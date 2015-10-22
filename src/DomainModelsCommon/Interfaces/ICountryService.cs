using System.Collections.Generic;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface ICountryService
	{
		List<Country> CountriesList { get; set; }
		Country GetByCountryName(string countryName);
		Country GetCountryByCountryCode2(string countryCode2);
	}
}