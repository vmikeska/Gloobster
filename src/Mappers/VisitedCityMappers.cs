using System.Linq;
using Gloobster.Common.DbEntity;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.WebApiObjects;
using Gloobster.WebApiObjects.PinBoard;
using MongoDB.Bson;

namespace Gloobster.Mappers
{
	public static class VisitedCityMappers
	{
		public static VisitedCityDO ToDO(this VisitedCityEntity entity)
		{
			if (entity == null)
			{
				return null;
			}
			
			var dObj = new VisitedCityDO
			{
				PortalUserId = entity.PortalUser_id.ToString(),
				City = entity.City,
				CountryCode = entity.CountryCode,
				Dates = entity.Dates.ToList(),				
				Location = entity.Location,
				GeoNamesId = entity.GeoNamesId				
			};
			
			return dObj;
		}

		public static VisitedCityEntity ToEntity(this VisitedCityDO dObj)
		{
			if (dObj == null)
			{
				return null;
			}

			var entity = new VisitedCityEntity
			{					
				City = dObj.City,
				CountryCode = dObj.CountryCode,
				Location = dObj.Location,
				Dates = dObj.Dates.ToArray(),
				GeoNamesId = dObj.GeoNamesId
			};

			if (!string.IsNullOrEmpty(dObj.PortalUserId))
			{
				entity.PortalUser_id = new ObjectId(dObj.PortalUserId);
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