using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.Entities.Trip;
using MongoDB.Bson;

namespace Gloobster.Entities.Planning
{
	public class PlanningAnytimeEntity: EntityBase
	{
		public ObjectId User_id { get; set; }

		public List<string> CountryCodes { get; set; }
		public List<int> Cities { get; set; } 
	}

	public class PlanningWeekendEntity : EntityBase
	{
		public ObjectId User_id { get; set; }
		public int ExtraDaysLength { get; set; }
		public List<string> CountryCodes { get; set; }
		public List<int> Cities { get; set; }
	}

	public class PlanningCustomEntity : EntityBase
	{
		public ObjectId User_id { get; set; }

		public List<CustomSearchSE> Searches { get; set; }
	}

	public class CustomSearchSE
	{
		public ObjectId id { get; set; }
		public string Name { get; set; }

        public int DaysFrom { get; set; }
        public int DaysTo { get; set; }

        public List<string> CCs { get; set; }
        public List<int> GIDs { get; set; }

        public Date Deparature { get; set; }
        public Date Arrival { get; set; }

        public bool StandardAirs { get; set; }
        public List<FromAirSE> CustomAirs { get; set; }

        public int Freq { get; set; }
	}

    public class FromAirSE
    {
        public string Text { get; set; }
        public int OrigId { get; set; }
    }
    
}
