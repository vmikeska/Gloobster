using System;
using System.Linq;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.ReqRes.PinBoard;
using MongoDB.Bson;

namespace Gloobster.Mappers
{
	public static class VisitedPlaceMappers
	{
		public static VisitedPlaceDO ToDO(this VisitedPlaceSE entity)
		{
			if (entity == null)
			{
				return null;
			}

			var dObj = new VisitedPlaceDO
			{								
				City = entity.City,
				CountryCode = entity.CountryCode,				
				Location = entity.Location,				
				SourceId = entity.SourceId,
				SourceType = (SourceType)entity.SourceType
			};

			if (entity.Dates != null)
			{
				dObj.Dates = entity.Dates.ToList();
			}

			return dObj;
		}

		public static VisitedPlaceSE ToEntity(this VisitedPlaceDO dObj)
		{
			if (dObj == null)
			{
				return null;
			}

			var entity = new VisitedPlaceSE
			{				
				City = dObj.City,
				CountryCode = dObj.CountryCode,				
				Location = dObj.Location,
				SourceId = dObj.SourceId,
				SourceType = (int)dObj.SourceType,				
			};

			if (dObj.Dates != null)
			{
				entity.Dates = dObj.Dates.ToArray();
			}
			
			return entity;
		}

		public static VisitedPlaceItemResponse ToResponse(this VisitedPlaceDO d)
		{
			if (d == null)
			{
				return null;
			}

			var response = new VisitedPlaceItemResponse
			{
				Dates = d.Dates,
				Location = d.Location,
				PortalUserId = d.PortalUserId,
                Count = d.Count
			};

			return response;
		}
	}


}
