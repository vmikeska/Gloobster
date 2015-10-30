using System.Threading.Tasks;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using MongoDB.Bson;

namespace Gloobster.UnitTests
{
	public class VisitedCountriesCreation : CreationsBase
	{
		private const string CountryCode1 = "CZ";
		private const string CountryCode2 = "DE";
		private const string CountryCode3 = "US";
		private const string CountryCode4 = "F";

		public static VisitedCountryDO CreateVisitedCountry1()
		{
			var dObj = new VisitedCountryDO
			{
				CountryCode2 = CountryCode1
			};
			return dObj;
		}

		public static VisitedCountryDO CreateVisitedCountry2()
		{
			var dObj = new VisitedCountryDO
			{
				CountryCode2 = CountryCode2
			};
			return dObj;
		}

		public static VisitedCountryDO CreateVisitedCountry3()
		{
			var dObj = new VisitedCountryDO
			{
				CountryCode2 = CountryCode3
			};
			return dObj;
		}

		public static VisitedCountryDO CreateVisitedCountry4()
		{
			var dObj = new VisitedCountryDO
			{
				CountryCode2 = CountryCode4
			};
			return dObj;
		}

		public async static Task<VisitedCountryEntity> CreateVisitedCountryEntity1(ObjectId portalUserEntityId, bool save)
		{
			var entity = new VisitedCountryEntity
			{
				id = ObjectId.GenerateNewId(),
				PortalUser_id = portalUserEntityId,
				CountryCode2 = CountryCode1
			};

			if (save)
			{
				entity = await DB.SaveAsync(entity);
			}

			return entity;
		}

		public async static Task<VisitedCountryEntity> CreateVisitedCountryEntity2(ObjectId portalUserEntityId, bool save)
		{
			var entity = new VisitedCountryEntity
			{
				id = ObjectId.GenerateNewId(),
				PortalUser_id = portalUserEntityId,
				CountryCode2 = CountryCode2
			};

			if (save)
			{
				entity = await DB.SaveAsync(entity);
			}

			return entity;
		}

		public async static Task<VisitedCountryEntity> CreateVisitedCountryEntity3(ObjectId portalUserEntityId, bool save)
		{
			var entity = new VisitedCountryEntity
			{
				id = ObjectId.GenerateNewId(),
				PortalUser_id = portalUserEntityId,
				CountryCode2 = CountryCode3
			};

			if (save)
			{
				entity = await DB.SaveAsync(entity);
			}

			return entity;
		}

		public async static Task<VisitedCountryEntity> CreateVisitedCountryEntity4(ObjectId portalUserEntityId, bool save)
		{
			var entity = new VisitedCountryEntity
			{
				id = ObjectId.GenerateNewId(),
				PortalUser_id = portalUserEntityId,
				CountryCode2 = CountryCode4
			};

			if (save)
			{
				entity = await DB.SaveAsync(entity);
			}

			return entity;
		}

	}
}