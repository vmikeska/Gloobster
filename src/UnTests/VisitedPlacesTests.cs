using System.Collections.Generic;
using Gloobster.Common.DbEntity;
using Gloobster.DomainModels;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Xunit;

namespace Gloobster.UnitTests
{
	public class VisitedPlacesTests : TestBase
	{
		public IPortalUserVisitedPlacesDomain VisitedPlaceDomain;

		public VisitedPlacesTests()
		{
			VisitedPlaceDomain = new PortalUserVisitedPlacesDomain(DBOper);
		}

		[Fact]
		public async void should_find_one_new_place()
		{
			DBOper.DropCollection<VisitedPlaceEntity>();
			DBOper.DropCollection<PortalUserEntity>();

			var portalUserEntity = await UserCreations.CreatePortalUserEntity1(true, true);

			await VisitedPlacesCreation.CreateVisitedPlaceEntity1(portalUserEntity.id, true);
			await VisitedPlacesCreation.CreateVisitedPlaceEntity2(portalUserEntity.id, true);

			var newPlaces = new List<VisitedPlaceDO> {VisitedPlacesCreation.CreateVisitedPlaceDO3()};

			var addedPlaces = await VisitedPlaceDomain.AddNewPlaces(newPlaces, portalUserEntity.id.ToString());
			Assert.Equal(addedPlaces.Count, 1);
		}

		[Fact]
		public async void should_not_find_a_new_place()
		{
			DBOper.DropCollection<VisitedPlaceEntity>();
			DBOper.DropCollection<PortalUserEntity>();

			var portalUserEntity = await UserCreations.CreatePortalUserEntity1(true, true);

			await VisitedPlacesCreation.CreateVisitedPlaceEntity1(portalUserEntity.id, true);
			await VisitedPlacesCreation.CreateVisitedPlaceEntity2(portalUserEntity.id, true);

			var newPlaces = new List<VisitedPlaceDO> { VisitedPlacesCreation.CreateVisitedPlaceDO2() };

			var addedPlaces = await VisitedPlaceDomain.AddNewPlaces(newPlaces, portalUserEntity.id.ToString());
			Assert.Null(addedPlaces);
		}
	}
}