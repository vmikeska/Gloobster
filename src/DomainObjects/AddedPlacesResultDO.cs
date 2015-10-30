using System.Collections.Generic;

namespace Gloobster.DomainObjects
{
	public class AddedPlacesResultDO
	{
		public List<VisitedCountryDO> Countries { get; set; }
		public List<VisitedPlaceDO> Places { get; set; }
		public List<VisitedCityDO> Cities { get; set; }   
	}
}