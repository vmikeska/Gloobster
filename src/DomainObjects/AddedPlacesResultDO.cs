using System.Collections.Generic;
using Gloobster.Enums;

namespace Gloobster.DomainObjects
{
	public class AddedPlacesResultDO
	{
		public List<VisitedCountryDO> Countries { get; set; }
        public List<VisitedStateDO> States { get; set; }
        public List<VisitedPlaceDO> Places { get; set; }
		public List<VisitedCityDO> Cities { get; set; }   
	}    
}