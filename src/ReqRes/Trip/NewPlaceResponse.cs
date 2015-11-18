using Gloobster.Enums;

namespace Gloobster.ReqRes.Trip
{
	public class NewPlaceResponse
	{
		public NewPlacePosition position { get; set; }

		public TripPlaceResponse place { get; set; }

		public TripTravelResponse travel { get; set; }
	}
}