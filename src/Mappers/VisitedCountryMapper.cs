﻿using Gloobster.Common.DbEntity;
using Gloobster.DomainModelsCommon.DO;
using MongoDB.Bson;

namespace Gloobster.Mappers
{
    public static class VisitedCountryMapper
    {
		public static VisitedCountryDO ToDO(this VisitedCountryEntity entity)
		{
			if (entity == null)
			{
				return null;
			}

			var dObj = new VisitedCountryDO
			{
				CountryCode2 = entity.CountryCode2,
				Dates = entity.Dates
			};

			return dObj;
		}

		public static VisitedCountryEntity ToEntity(this VisitedCountryDO dObj)
		{
			if (dObj == null)
			{
				return null;
			}

			var entity = new VisitedCountryEntity
			{
				CountryCode2 = dObj.CountryCode2,
				Dates = dObj.Dates
			};

			if (!string.IsNullOrEmpty(dObj.PortalUserId))
			{
				entity.PortalUser_id = new ObjectId(dObj.PortalUserId);
			}

			return entity;
		}		
    }
}
