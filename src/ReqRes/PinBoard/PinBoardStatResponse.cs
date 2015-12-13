namespace Gloobster.ReqRes.PinBoard
{
	public class PinBoardStatResponse
	{
		public VisitedPlaceItemResponse[] visitedPlaces { get; set; }
		public VisitedCityItemResponse[] visitedCities { get; set; }		
		public VisitedCountryItemResponse[] visitedCountries { get; set; }

		public int citiesCount { get; set; }
		public int countriesCount { get; set; }
		public int worldTraveledPercent { get; set; }
	}
}