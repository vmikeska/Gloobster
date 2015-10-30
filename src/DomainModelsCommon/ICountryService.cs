using System.Collections.Generic;

namespace Gloobster.DomainInterfaces
{
	public interface ICountryService
	{
		List<Country> CountriesList { get; set; }
		Country GetByCountryName(string countryName);
		Country GetCountryByCountryCode2(string countryCode2);
	}
}