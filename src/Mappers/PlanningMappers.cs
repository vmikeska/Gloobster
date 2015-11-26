using System.Linq;
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
				countryCodes = e.CountryCodes,
				extraDaysLength = e.ExtraDaysLength
			};
			return r;
		}

		public static PlanningCustomResponse ToResponse(this PlanningCustomEntity e)
		{
			var r = new PlanningCustomResponse
			{
				searches = e.Searches.Select(s => s.ToResponse()).ToList()
			};
			return r;
		}

		public static CustomSearchResponse ToResponse(this CustomSearchSE e)
		{
			var r = new CustomSearchResponse
			{
				id = e.id.ToString(),
				countryCodes = e.CountryCodes,
				cites = e.Cites,
				from = e.From,				
				months = e.Months,
				roughlyDays = e.RoughlyDays,
				searchName = e.SearchName,
				to = e.To,
				years = e.Years
			};
			return r;
		}
	}
}