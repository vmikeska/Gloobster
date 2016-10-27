using Gloobster.DomainObjects;
using Gloobster.Entities.Trip;
using Gloobster.ReqRes.Airport;

namespace Gloobster.Mappers
{
	public static class AirportSaveMappers
	{
		public static AirportSaveSE ToEntity(this AirportSaveDO d)
		{
			var e = new AirportSaveSE
			{
				OrigId = d.OrigId,
                City = d.City,
                AirCode = d.AirCode,
                AirName = d.AirName				
			};

			return e;
		}

		public static AirportSaveDO ToDO(this AirportSaveSE e)
		{
			var d = new AirportSaveDO
			{
                OrigId = e.OrigId,
                City = e.City,
                AirCode = e.AirCode,
                AirName = e.AirName
            };

			return d;
		}

		public static AirportSaveResponse ToResponse(this AirportSaveDO d)
		{
			var r = new AirportSaveResponse
			{
				origId = d.OrigId,
                city = d.City,
                airCode = d.AirCode,
                airName = d.AirName				
			};

			return r;
		}

		public static AirportSaveResponse ToResponse(this AirportSaveSE e)
		{
			var r = new AirportSaveResponse
			{
				origId = e.OrigId,
				city = e.City,
                airCode = e.AirCode,
                airName = e.AirName
			};

			return r;
		}
	}
}