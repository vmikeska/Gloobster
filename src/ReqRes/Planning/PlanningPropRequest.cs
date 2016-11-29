using System.Collections.Generic;
using Gloobster.Enums;

namespace Gloobster.ReqRes.Planning
{
	public class SelCityRequest
	{		
		public PlanningType type { get; set; }
		public int gid { get; set; }
        public bool selected { get; set; }
        public string customId { get; set; }        
	}

    public class SelCountryRequest
    {
        public PlanningType type { get; set; }
        public string cc { get; set; }
        public bool selected { get; set; }
        public string customId { get; set; }
    }
}