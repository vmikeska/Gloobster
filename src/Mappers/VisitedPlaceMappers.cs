using System;
using System.Linq;
using Gloobster.Common.DbEntity;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.WebApiObjects;
using Gloobster.WebApiObjects.PinBoard;
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
				Dates = entity.Dates.ToList(),
				Location = entity.Location,				
				SourceId = entity.SourceId,
				SourceType = (SourceTypeDO)entity.SourceType
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
				Dates = dObj.Dates.ToArray(),
				Location = dObj.Location,
				SourceId = dObj.SourceId,
				SourceType = (int)dObj.SourceType,				
			};

			if (!string.IsNullOrEmpty(dObj.PortalUserId))
			{
				entity.PortalUser_id = new ObjectId(dObj.PortalUserId);
			}

			return entity;
		}

		public static VisitedPlaceItemResponse ToResponse(this VisitedPlaceDO dObj)
		{
			if (dObj == null)
			{
				return null;
			}

			var response = new VisitedPlaceItemResponse
			{
				Dates = dObj.Dates,
				Location = dObj.Location,
				PortalUserId = dObj.PortalUserId				
			};

			return response;
		}
	}


}
