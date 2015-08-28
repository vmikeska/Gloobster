using Gloobster.DomainModels.Services.GeonamesService;

namespace Gloobster.DomainModels.Services.GeoService
{
	public interface ICountryService
	{
		Country GetByCountryName(string countryName);
	}
}