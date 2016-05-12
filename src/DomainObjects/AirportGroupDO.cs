using System.Collections.Generic;
using Gloobster.Common;

namespace Gloobster.DomainObjects
{
    //public class AirportGroupDO
    //{
    //	public List<int> AirportIds { get; set; }
    //	public string City { get; set; }
    //	public string CountryCode { get; set; }
    //	public int GID { get; set; }
    //	public LatLng Coord { get; set; }
    //	public int Population { get; set; }
    //}

    public class NewAirportCityDO
    {
        public string Name { get; set; }
        public string CountryCode { get; set; }
        public LatLng Coord { get; set; }
        public int GID { get; set; }
        public int Population { get; set; }
        public string SpId { get; set; }
    }

    
}