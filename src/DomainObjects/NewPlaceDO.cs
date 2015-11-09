using System.Collections.Generic;
using Gloobster.Enums;

namespace Gloobster.DomainObjects
{
	public class NewPlaceDO
	{		
		public NewPlacePosition Position { get; set; }

		public string SelectorId { get; set; }
	}

	public class TripPlannerStructureLiteDO
	{
		public List<TravelLiteDO> Travels { get; set; }
		public List<PlaceLiteDO> Places { get; set; }
    }

	public class PlaceLiteDO
	{
		public string Id { get; set; }		
		public string ArrivingId { get; set; }
		public string LeavingId { get; set; }
		public int OrderNo { get; set; }
	}

	public class TravelLiteDO
	{
		public string Id { get; set; }
		public TravelType Type { get; set; }
	}
}