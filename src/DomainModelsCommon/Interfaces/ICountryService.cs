namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface ICountryService
	{
		Country GetByCountryName(string countryName);
		Country GetCountryByCountryCode2(string countryCode2);
	}
}