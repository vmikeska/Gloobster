using System.Collections.Generic;
using Gloobster.Common;
using Gloobster.Database;
using MongoDB.Bson;

namespace Gloobster.Entities
{    
    public class VisitedCityAggregatedEntity : EntityBase
    {        
        public LatLng Location { get; set; }
        public string CountryCode { get; set; }
        public string City { get; set; }
        public int GID { get; set; }
        public List<string> Visitors { get; set; }
    }

    public class VisitedPlaceAggregatedEntity : EntityBase
    {        
        public string SourceId { get; set; }
        public int SourceType { get; set; }

        public LatLng Location { get; set; }
        public List<string> Visitors { get; set; }
    }

    public class VisitedCountryAggregatedEntity : EntityBase
    {        
        public string CountryCode { get; set; }
        public List<string> Visitors { get; set; }
    }

    public class VisitedStatesAggregatedEntity : EntityBase
    {
        public string StateCode { get; set; }
        public List<string> Visitors { get; set; }
    }
}