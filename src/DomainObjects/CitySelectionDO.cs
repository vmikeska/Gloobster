using System.Collections.Generic;
using Gloobster.Common;
using Gloobster.Enums;

namespace Gloobster.DomainObjects
{
	public class CitySelectionDO
	{
		public PlanningType PlanningType { get; set; }
		public string UserId { get; set; }
		public int GID { get; set; }
		public bool Selected { get; set; }
		public string CustomId { get; set; }
	}    
}