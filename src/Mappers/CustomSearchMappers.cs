using System.Linq;
using Gloobster.DomainObjects;
using Gloobster.Entities.SearchEngine;
using Gloobster.ReqRes.Planning;

namespace Gloobster.Mappers
{
	public static class CustomSearchMappers
	{
		
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
                freq = e.Freq,
                started = e.Started,
                lastNewsletter = e.LastNewsletter
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
                freq = d.Freq,
                started = d.Started,
                lastNewsletter = d.LastNewsletter
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
                Freq = e.Freq,
                Started = e.Started,
                LastNewsletter = e.LastNewsletter
            };
            
			return r;
		}

	}
}