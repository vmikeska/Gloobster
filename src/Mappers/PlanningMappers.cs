using Gloobster.Entities.Planning;
using Gloobster.ReqRes.Planning;

namespace Gloobster.Mappers
{
	public static class PlanningMappers
	{
		public static PlanningAnytimeResponse ToResponse(this PlanningAnytimeEntity e)
		{
			var r = new PlanningAnytimeResponse
			{
				countryCodes = e.CountryCodes
			};
			return r;
		}

		public static PlanningWeekendResponse ToResponse(this PlanningWeekendEntity e)
		{
			var r = new PlanningWeekendResponse
			{
				countryCodes = e.CountryCodes
			};
			return r;
		}
	}
}