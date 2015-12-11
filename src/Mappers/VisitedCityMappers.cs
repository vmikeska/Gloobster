using System.Linq;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.ReqRes.PinBoard;
using MongoDB.Bson;

namespace Gloobster.Mappers
{
	public static class VisitedCityMappers
	{
		public static VisitedCityDO ToDO(this VisitedCitySE entity)
		{
			if (entity == null)
			{
				return null;
			}
			
			var dObj = new VisitedCityDO
			{				
				City = entity.City,
				CountryCode = entity.CountryCode,				
				Location = entity.Location,
				GeoNamesId = entity.GeoNamesId				
			};

			if (entity.Dates != null)
			{
				dObj.Dates = entity.Dates.ToList();
			}
			
			return dObj;
		}

		public static VisitedCitySE ToEntity(this VisitedCityDO dObj)
		{
			if (dObj == null)
			{
				return null;
			}

			var entity = new VisitedCitySE
			{					
				City = dObj.City,
				CountryCode = dObj.CountryCode,
				Location = dObj.Location,				
				GeoNamesId = dObj.GeoNamesId
			};
			
			if (dObj.Dates != null)
			{
				entity.Dates = dObj.Dates.ToArray();
			}

			return entity;
		}

		public static VisitedCityItemResponse ToResponse(this VisitedCityDO dObj)
		{
			if (dObj == null)
			{
				return null;
			}

			var response = new VisitedCityItemResponse
			{
				City = dObj.City,
				CountryCode = dObj.CountryCode,
				Dates = dObj.Dates,
				Location = dObj.Location,
				PortalUserId = dObj.PortalUserId,
				GeoNamesId = dObj.GeoNamesId
			};

			return response;
		}
	}
}