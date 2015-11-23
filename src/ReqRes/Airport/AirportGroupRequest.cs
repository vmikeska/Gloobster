using Gloobster.Enums;

namespace Gloobster.ReqRes.Airport
{
	public class AirportGroupRequest
	{
		public double latNorth { get; set; }
		public double lngWest { get; set; }
		public double latSouth { get; set; }
		public double lngEast { get; set; }
		public int? minPopulation { get; set; }
		public PlanningType? planningType { get; set; }

		//public string latNorth { get; set; }
		//public string lngWest { get; set; }
		//public string latSouth { get; set; }
		//public string lngEast { get; set; }
		//public string minPopulation { get; set; }
	}
}