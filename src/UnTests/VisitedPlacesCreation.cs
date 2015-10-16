using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
using Gloobster.DomainModelsCommon.DO;
using MongoDB.Bson;

namespace Gloobster.UnitTests
{
	public class VisitedPlacesCreation: CreationsBase
	{		
		static VisitedPlacesCreation()
		{
		}

		private const string City1 = "Brno";
		private const SourceTypeDO SourceType1 = SourceTypeDO.Facebook;		
		private const string SourceId1 = "1111";
		private const string CountryCode1 = "CZ";
		private const float PlaceLongitude1 = 9.99f;
		private const float PlaceLatitude1 = 8.88f;

		private const string City2 = "Prague";
		private const SourceTypeDO SourceType2 = SourceTypeDO.Facebook;
		private const string SourceId2 = "2222";
		private const string CountryCode2 = "DE";
		private const float PlaceLongitude2 = 9.99f;
		private const float PlaceLatitude2 = 8.88f;

		private const string City3 = "Ostrava";
		private const SourceTypeDO SourceType3 = SourceTypeDO.Facebook;
		private const string SourceId3 = "3333";
		private const string CountryCode3 = "EE";
		private const float PlaceLongitude3 = 9.99f;
		private const float PlaceLatitude3 = 8.88f;

		public static VisitedCityDO CreateVisitedPlaceDO1()
		{
			var dObj = new VisitedCityDO
			{
				City = City1,
				//SourceType = SourceType1,				
				//SourceId = SourceId1,
				//CountryCode = CountryCode1,
				//Longitude = PlaceLongitude1,
				//Latitude = PlaceLatitude1
			};

			return dObj;
		}

		public static VisitedCityDO CreateVisitedPlaceDO2()
		{
			var dObj = new VisitedCityDO
			{
				City = City2,
				//SourceType = SourceType2,
				//SourceId = SourceId2,
				//CountryCode = CountryCode2,
				//Longitude = PlaceLongitude2,
				//Latitude = PlaceLatitude2
			};

			return dObj;
		}

		public static VisitedCityDO CreateVisitedPlaceDO3()
		{
			var dObj = new VisitedCityDO
			{
				City = City3,
				//SourceType = SourceType3,
				//SourceId = SourceId3,
				//CountryCode = CountryCode3,
				//Longitude = PlaceLongitude3,
				//Latitude = PlaceLatitude3
			};

			return dObj;
		}

		public async static Task<VisitedPlaceEntity> CreateVisitedPlaceEntity1(ObjectId portalUserEntityId, bool save)
		{
			var entity = new VisitedPlaceEntity
			{
				id = ObjectId.GenerateNewId(),
				PortalUser_id = portalUserEntityId,
				City = City1,
				//SourceType = SourceType1.ToString(),				
				SourceId = SourceId1,
				CountryCode = CountryCode1,
				//PlaceLongitude = PlaceLongitude1,
				//PlaceLatitude = PlaceLatitude1
			};

			if (save)
			{
				entity = await DB.SaveAsync(entity);
			}

			return entity;
		}

		public async static Task<VisitedPlaceEntity> CreateVisitedPlaceEntity2(ObjectId portalUserEntityId, bool save)
		{
			var entity = new VisitedPlaceEntity
			{
				id = ObjectId.GenerateNewId(),
				PortalUser_id = portalUserEntityId,
				City = City2,
				//SourceType = SourceType2.ToString(),
				SourceId = SourceId2,
				CountryCode = CountryCode2,
				//PlaceLongitude = PlaceLongitude2,
				//PlaceLatitude = PlaceLatitude2
			};

			if (save)
			{
				entity = await DB.SaveAsync(entity);
			}

			return entity;
		}

		public async static Task<VisitedPlaceEntity> CreateVisitedPlaceEntity3(ObjectId portalUserEntityId, bool save)
		{
			var entity = new VisitedPlaceEntity
			{
				id = ObjectId.GenerateNewId(),
				PortalUser_id = portalUserEntityId,
				City = City3,
				//SourceType = SourceType3.ToString(),
				SourceId = SourceId3,
				CountryCode = CountryCode3,
				//PlaceLongitude = PlaceLongitude3,
				//PlaceLatitude = PlaceLatitude3
			};

			if (save)
			{
				entity = await DB.SaveAsync(entity);
			}

			return entity;
		}


	}
}