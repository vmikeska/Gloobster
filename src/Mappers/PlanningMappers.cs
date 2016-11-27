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
        
		public static CustomSearchResponse ToResponse(this CustomSearchSE e)
		{
			var r = new CustomSearchResponse
			{
				id = e.id.ToString(),
                arrival = e.Arrival,
                ccs = e.CCs,
                customAirs = e.CustomAirs.Select(a => a.ToResponse()).ToList(),
                daysFrom = e.DaysFrom,
                daysTo = e.DaysTo,
                deparature = e.Deparature,
                gids = e.GIDs,
                name = e.Name,
                standardAirs = e.StandardAirs,
                freq = e.Freq
			};
            
			return r;
		}

	    public static FromAirResponse ToResponse(this FromAirSE e)
	    {
	        var r = new FromAirResponse
	        {
	            text = e.Text,
	            origId = e.OrigId
	        };

	        return r;
	    }

        public static FromAirResponse ToResponse(this FromAirDO e)
        {
            var r = new FromAirResponse
            {
                text = e.Text,
                origId = e.OrigId
            };

            return r;
        }

        public static FromAirDO ToDO(this FromAirSE e)
        {
            var r = new FromAirDO
            {
                Text = e.Text,
                OrigId = e.OrigId
            };

            return r;
        }

        public static CustomSearchResponse ToResponse(this CustomSearchDO d)
		{
			var r = new CustomSearchResponse
			{
                id = d.Id,
                arrival = d.Arrival,
                ccs = d.CCs,
                customAirs = d.CustomAirs.Select(a => a.ToResponse()).ToList(),
                daysFrom = d.DaysFrom,
                daysTo = d.DaysTo,
                deparature = d.Deparature,
                gids = d.GIDs,
                name = d.Name,
                standardAirs = d.StandardAirs,
                freq = d.Freq
            };
			return r;
		}

		public static CustomSearchDO ToDO(this CustomSearchSE e)
		{
			var r = new CustomSearchDO
			{
                Id = e.id.ToString(),
                Arrival = e.Arrival,
                Deparature = e.Deparature,
                DaysFrom = e.DaysFrom,
                DaysTo = e.DaysTo,
                Name = e.Name,
                CCs = e.CCs,
                GIDs = e.GIDs,
                StandardAirs = e.StandardAirs,                
                CustomAirs = e.CustomAirs.Select(a => a.ToDO()).ToList(),
                Freq = e.Freq
            };
            
			return r;
		}

	}
}