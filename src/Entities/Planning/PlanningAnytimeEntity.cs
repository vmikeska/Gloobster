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
		public List<int> Cities { get; set; } 
	}

	public class PlanningWeekendEntity : EntityBase
	{
		public ObjectId PortalUser_id { get; set; }
		public int ExtraDaysLength { get; set; }
		public List<string> CountryCodes { get; set; }
		public List<int> Cities { get; set; }
	}

	public class PlanningCustomEntity : EntityBase
	{
		public ObjectId PortalUser_id { get; set; }

		public List<CustomSearchSE> Searches { get; set; }
	}

	public class CustomSearchSE
	{
		public ObjectId id { get; set; }
		public string SearchName { get; set; }

		public List<FlightSE> FromAirports { get; set; }


		public List<string> CountryCodes { get; set; }
		public List<int> Cities { get; set; }

		public List<int> Years { get; set; }
		public List<int> Months { get; set; }
		public DateTime? From { get; set; }
		public DateTime? To { get; set; }

		public int RoughlyDays { get; set; }
	}
}
