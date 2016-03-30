using System;
using System.Collections.Generic;

namespace Gloobster.DomainObjects
{
	public class CustomSearchDO
	{
		public string Id { get; set; }
		public string SearchName { get; set; }

		public List<AirportSaveDO> FromAirports { get; set; }


		public List<string> CountryCodes { get; set; }
		public List<int> Cities { get; set; }

		public List<int> Years { get; set; }
		public List<int> Months { get; set; }
		public DateTime? From { get; set; }
		public DateTime? To { get; set; }

		public int RoughlyDays { get; set; }
	}
    
}