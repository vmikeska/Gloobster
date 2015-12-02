using System.Linq;
using Gloobster.DomainObjects;
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
				from = e.From,				
				months = e.Months,
				roughlyDays = e.RoughlyDays,
				searchName = e.SearchName,
				to = e.To,
				years = e.Years
			};

			if (e.FromAirports != null)
			{
				r.fromAirports = e.FromAirports.Select(a => a.ToResponse()).ToList();
			}

			return r;
		}

		public static CustomSearchResponse ToResponse(this CustomSearchDO d)
		{
			var r = new CustomSearchResponse
			{
				id = d.Id,
				countryCodes = d.CountryCodes,
				from = d.From,
				months = d.Months,
				roughlyDays = d.RoughlyDays,
				searchName = d.SearchName,
				to = d.To,
				years = d.Years
			};
			return r;
		}

		public static CustomSearchDO ToDO(this CustomSearchSE e)
		{
			var r = new CustomSearchDO
			{
				Id = e.id.ToString(),
				CountryCodes = e.CountryCodes,
				Cities = e.Cities,
				From = e.From,
				Months = e.Months,
				RoughlyDays = e.RoughlyDays,
				SearchName = e.SearchName,
				To = e.To,
				Years = e.Years,				
			};

			if (e.FromAirports != null)
			{
				r.FromAirports = e.FromAirports.Select(a => a.ToDO()).ToList();
			}
			

			return r;
		}

	}
}