using System.Collections.Generic;
using Gloobster.Enums;

namespace Gloobster.ReqRes.Planning
{
	public class PlanningPropRequest
	{		
		public PlanningType planningType { get; set; }
		public string propertyName { get; set; }
		public Dictionary<string, string> values { get; set; } 
	}
}