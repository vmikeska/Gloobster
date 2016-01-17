
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.ReqRes.PinBoard;
using MongoDB.Bson;

namespace Gloobster.Mappers
{
    public static class VisitedCountryMapper
    {
		public static VisitedCountryDO ToDO(this VisitedCountrySE e)
		{
			if (e == null)
			{
				return null;
			}

			var d = new VisitedCountryDO
			{
				CountryCode2 = e.CountryCode2,
				Dates = e.Dates
			};

			return d;
		}

		public static VisitedCountrySE ToEntity(this VisitedCountryDO d)
		{
			if (d == null)
			{
				return null;
			}

			var entity = new VisitedCountrySE
			{
				CountryCode2 = d.CountryCode2,
				Dates = d.Dates
			};
			
			return entity;
		}

		public static VisitedCountryItemResponse ToResponse(this VisitedCountryDO d)
		{
			if (d == null)
			{
				return null;
			}

			var response = new VisitedCountryItemResponse
			{
				PortalUserId = d.PortalUserId,
				Dates = d.Dates,
				CountryCode2 = d.CountryCode2,
                Count = d.Count
			};

			return response;
		}
	}
}
