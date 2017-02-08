using System.Collections.Generic;

namespace Gloobster.DomainInterfaces
{
	public interface ICountryService
	{
		List<Country> CountriesList { get; set; }
		Country GetByCountryName(string countryName);
		Country GetCountryByCountryCode2(string countryCode2);
		Country GetCountryByCountryCode3(string countryCode2);
	    List<Country> GetByCountryNameStarting(string txt);
	    List<Country> GetCountryByCountryCode2Starting(string txt);

	}
}