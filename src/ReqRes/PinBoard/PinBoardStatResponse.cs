namespace Gloobster.ReqRes.PinBoard
{
	public class PinBoardStatResponse
	{
		public VisitedPlaceItemResponse[] VisitedPlaces { get; set; }
		public VisitedCityItemResponse[] VisitedCities { get; set; }		
		public VisitedCountryItemResponse[] VisitedCountries { get; set; }
	}
}