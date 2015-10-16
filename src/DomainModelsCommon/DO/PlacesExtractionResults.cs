using System.Collections.Generic;

namespace Gloobster.DomainModelsCommon.DO
{
	public class PlacesExtractionResults
	{
		public List<VisitedCityDO> VisitedCities { get; set; }
		public List<VisitedPlaceDO> VisitedPlaces { get; set; }
		public List<VisitedCountryDO> VisitedCountries { get; set; }
	}
}