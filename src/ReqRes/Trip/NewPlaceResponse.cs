using Gloobster.Enums;

namespace Gloobster.ReqRes.Trip
{
	public class NewPlaceResponse
	{
		public NewPlacePosition position { get; set; }

		public PlaceLiteResponse place { get; set; }

		public TravelLiteResponse travel { get; set; }
	}
}