using Gloobster.Enums;

namespace Gloobster.DomainObjects
{
	public class CountrySelectionDO
	{
		public PlanningType PlanningType { get; set; }
		public string UserId { get; set; }
		public string CountryCode { get; set; }
		public bool Selected { get; set; }
		public int CustomId { get; set; }
	}
}