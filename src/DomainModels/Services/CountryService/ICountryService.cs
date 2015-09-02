using Gloobster.DomainModels.Services.GeonamesService;

namespace Gloobster.DomainModels.Services.CountryService
{
	public interface ICountryService
	{
		Country GetByCountryName(string countryName);
		Country GetCountryByCountryCode2(string countryCode2);
	}
}