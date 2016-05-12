using System.Collections.Generic;
using Gloobster.Common;
using Gloobster.Database;

namespace Gloobster.Entities
{
    //public class AirportGroupEntity : EntityBase
    //{
    //	public List<int> AirportIds { get; set; }
    //	public string City { get; set; }
    //	public string CountryCode { get; set; }
    //	public int GID { get; set; }
    //	public LatLng Coord { get; set; }		
    //	public int Population { get; set; }
    //	public int TotalFlights { get; set; }
    //}

    public class NewAirportCityEntity : EntityBase
    {
        public string Name { get; set; }
        public string CountryCode { get; set; }
        public LatLng Coord { get; set; }
        public int GID { get; set; }
        public int? population { get; set; }
        public string SpId { get; set; }
    }
}