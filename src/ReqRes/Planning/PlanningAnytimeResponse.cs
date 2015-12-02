using System;
using System.Collections.Generic;
using Gloobster.ReqRes.Airport;

namespace Gloobster.ReqRes.Planning
{
	public class PlanningAnytimeResponse
	{
		public List<string> countryCodes { get; set; }		
	}

	public class PlanningWeekendResponse
	{
		public int extraDaysLength { get; set; }
		public List<string> countryCodes { get; set; }
	}

	public class PlanningCustomResponse
	{
		public List<CustomSearchResponse> searches { get; set; }
	}

	//public class PlanningCustomLiteListResponse
	//{
	//	public List<CustomSearchResponse> searches { get; set; }
	//}

	public class CustomSearchResponse
	{
		public string id { get; set; }
		public string searchName { get; set; }

		public List<string> countryCodes { get; set; }

		public List<int> years { get; set; }
		public List<int> months { get; set; }
		public DateTime? from { get; set; }
		public DateTime? to { get; set; }

		public int roughlyDays { get; set; }

		public List<AirportSaveResponse> fromAirports { get; set; }
	}

}