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
				SelectedName = d.SelectedName
			};

			return e;
		}

		public static AirportSaveDO ToDO(this AirportSaveSE e)
		{
			var d = new AirportSaveDO
			{
				OrigId = e.OrigId,
				SelectedName = e.SelectedName
			};

			return d;
		}

		public static AirportSaveResponse ToResponse(this AirportSaveDO d)
		{
			var r = new AirportSaveResponse
			{
				origId = d.OrigId,
				selectedName = d.SelectedName
			};

			return r;
		}

		public static AirportSaveResponse ToResponse(this AirportSaveSE e)
		{
			var r = new AirportSaveResponse
			{
				origId = e.OrigId,
				selectedName = e.SelectedName
			};

			return r;
		}
	}
}