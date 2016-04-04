using System.Collections.Generic;

namespace Gloobster.ReqRes.PinBoard
{
	public class PinBoardStatResponse
	{
		public VisitedPlaceItemResponse[] visitedPlaces { get; set; }
		public VisitedCityItemResponse[] visitedCities { get; set; }		
		public VisitedCountryItemResponse[] visitedCountries { get; set; }
        public VisitedStateItemResponse[] visitedStates { get; set; }

        public int citiesCount { get; set; }
        public int countriesCount { get; set; }
        public int worldTraveledPercent { get; set; }
        public int statesCount { get; set; }

        public List<int> europeCities { get; set; }
        public List<int> asiaCities { get; set; }
        public List<int> northAmericaCities { get; set; }
        public List<int> southAmericaCities { get; set; }
        public List<int> africaCities { get; set; }

        public List<string> countryCodes { get; set; }
        public List<string> stateCodes { get; set; }
        public List<int> topCities { get; set; }
    }
}