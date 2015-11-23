using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Entities.Trip;
using MongoDB.Bson;

namespace Gloobster.Entities.Planning
{
	public class PlanningAnytimeEntity: EntityBase
	{
		public ObjectId PortalUser_id { get; set; }

		public List<string> CountryCodes { get; set; }
		public List<int> Cites { get; set; } 
	}

	public class PlanningWeekendEntity : EntityBase
	{
		public ObjectId PortalUser_id { get; set; }
		public int LongWeekend { get; set; }
		public List<string> CountryCodes { get; set; }
	}

	public class PlanningCustomEntity : EntityBase
	{
		public ObjectId PortalUser_id { get; set; }

		public List<CustomSearchSE> Searches { get; set; }
	}

	public class CustomSearchSE
	{
		public string SearchName { get; set; }

		public List<FlightSE> FromAirports { get; set; }
		public List<string> FromCountries { get; set; }

		public List<string> ToCountries { get; set; }

		public List<int> Years { get; set; }
		public List<int> Months { get; set; }
		public DateTime? From { get; set; }
		public DateTime? To { get; set; }

		public int? RoughlyDays { get; set; }
		public int? MinDays { get; set; }
	}
}
