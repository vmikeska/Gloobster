using Gloobster.Enums;

namespace Gloobster.ReqRes.Trip
{
	public class NewPlaceRequest
	{
		public string selectorId { get; set; }
		public NewPlacePosition position { get; set; }

		public string tripId { get; set; }
				
	}
}