using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.DomainObjects;
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

		public static AirportResponse ToResponse(this AirportDO d)
		{
			var r = new AirportResponse
			{
				city = d.City,				
				origId = d.OrigId,
				countryCode = d.CountryCode,
				name = d.Name,
				coord = d.Coord,
				alt = d.Alt,
				iataFaa = d.IataFaa,
				icao = d.Icao
			};
			return r;
		}

		public static AirportDO ToDO(this AirportEntity e)
	    {
		    var d = new AirportDO
		    {
			    GeoNamesId = e.GeoNamesId,
			    CountryCode = e.CountryCode,
			    Name = e.Name,
			    City = e.City,
			    Coord = e.Coord,
			    Alt = e.Alt,
			    IataFaa = e.IataFaa,
				OrigId = e.OrigId,
			    Icao = e.Icao
		    };

		    return d;
	    }

		public static AirportEntity ToEntity(this AirportDO d)
		{
			var e = new AirportEntity
			{
				GeoNamesId = d.GeoNamesId,
				CountryCode = d.CountryCode,
				Name = d.Name,
				City = d.City,
				Coord = d.Coord,
				Alt = d.Alt,
				IataFaa = d.IataFaa,
				OrigId = d.OrigId,
				Icao = d.Icao
			};

			return e;
		}
	}
}
