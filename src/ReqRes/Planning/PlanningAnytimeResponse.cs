using System.Collections.Generic;

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
}