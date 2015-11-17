using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Entities;
using Gloobster.ReqRes.Airport;

namespace Gloobster.Mappers
{
    public static class AirportMappers
    {
	    public static AirportResponse ToResponse(this AirportEntity e)
	    {
		    var r = new AirportResponse
		    {
			    city = e.City,
			    id = e.id.ToString(),
			    origId = e.OrigId,
			    countryCode = e.CountryCode,
			    name = e.Name,
			    coord = e.Coord,
			    alt = e.Alt,
			    iataFaa = e.IataFaa,
			    icao = e.Icao
		    };
		    return r;
	    }
    }
}
