using System;
using Gloobster.Common.DbEntity;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.WebApiObjects;
using MongoDB.Bson;

namespace Gloobster.Mappers
{
    public static class VisitedPlaceMappers
    {
		public static VisitedPlaceDO ToDO(this VisitedPlaceEntity entity)
		{
			if (entity == null)
			{
				return null;
			}
			
			var dObj = new VisitedPlaceDO
			{
				PortalUserId = entity.PortalUser_id.ToString(),
                City = entity.City,
				CountryCode = entity.CountryCode,
				PlaceLatitude = entity.PlaceLatitude,
				PlaceLongitude = entity.PlaceLongitude,
				SourceId = entity.SourceId,
				SourceType = (SourceTypeDO)Enum.Parse(typeof(SourceTypeDO), entity.SourceType)
			};
			
			return dObj;
		}

		public static VisitedPlaceEntity ToEntity(this VisitedPlaceDO dObj)
		{
			if (dObj == null)
			{
				return null;
			}

			var entity = new VisitedPlaceEntity
			{				
				City = dObj.City,
				CountryCode = dObj.CountryCode,
				PlaceLatitude = dObj.PlaceLatitude,
				PlaceLongitude = dObj.PlaceLongitude,
				SourceId = dObj.SourceId,
				SourceType = dObj.SourceType.ToString()
			};

			if (!string.IsNullOrEmpty(dObj.PortalUserId))
			{
				entity.PortalUser_id = new ObjectId(dObj.PortalUserId);
			}
			
			return entity;
		}

		public static VisitedPlaceItem ToResponse(this VisitedPlaceDO dObj)
		{
			if (dObj == null)
			{
				return null;
			}

			var response = new VisitedPlaceItem
			{
				City = dObj.City,
				CountryCode = dObj.CountryCode,
				PlaceLatitude = dObj.PlaceLatitude,
				PlaceLongitude = dObj.PlaceLongitude,
				SourceId = dObj.SourceId,
				SourceType = dObj.SourceType.ToString()
			};
			
			return response;
		}
	}

	
}
