﻿//using System.Collections.Generic;
//using Gloobster.DomainInterfaces;
//using Gloobster.DomainObjects;
//using Gloobster.Entities;

////using Xunit;

//namespace Gloobster.UnitTests
//{
//	public class VisitedPlacesTests : TestBase
//	{
//		//public VisitedCitiesDomain VisitedCityDomain;

//		public VisitedPlacesTests()
//		{
//			//VisitedCityDomain = new VisitedCitiesDomain();
//		}

//		//[Fact]
//		public async void should_find_one_new_place()
//		{
//			DBOper.DropCollection<VisitedPlaceEntity>();
//			DBOper.DropCollection<PortalUserEntity>();

//			var portalUserEntity = await UserCreations.CreatePortalUserEntity1(true, true);

//			await VisitedPlacesCreation.CreateVisitedPlaceEntity1(portalUserEntity.id, true);
//			await VisitedPlacesCreation.CreateVisitedPlaceEntity2(portalUserEntity.id, true);

//			var newPlaces = new List<VisitedCityDO> {VisitedPlacesCreation.CreateVisitedPlaceDO3()};

//			//var addedPlaces = await VisitedCityDomain.AddNewCitiesAsync(newPlaces, portalUserEntity.id.ToString());
//			//Assert.Equal(addedPlaces.Count, 1);
//		}

//		//[Fact]
//		public async void should_not_find_a_new_place()
//		{
//			DBOper.DropCollection<VisitedPlaceEntity>();
//			DBOper.DropCollection<PortalUserEntity>();

//			var portalUserEntity = await UserCreations.CreatePortalUserEntity1(true, true);

//			await VisitedPlacesCreation.CreateVisitedPlaceEntity1(portalUserEntity.id, true);
//			await VisitedPlacesCreation.CreateVisitedPlaceEntity2(portalUserEntity.id, true);

//			var newPlaces = new List<VisitedCityDO> { VisitedPlacesCreation.CreateVisitedPlaceDO2() };

//			//var addedPlaces = await VisitedCityDomain.AddNewCitiesAsync(newPlaces, portalUserEntity.id.ToString());
//			//Assert.Null(addedPlaces);
//		}
//	}

//	public class VisitedCountriesTests : TestBase
//	{
//		public IVisitedCountriesDomain CountriesDomain;

//		public VisitedCountriesTests()
//		{
//			//CountriesDomain = new VisitedCountriesDomain();
//		}

//		//[Fact]
//		public async void should_find_one_new_country()
//		{
//			DBOper.DropCollection<VisitedCountryEntity>();
//			DBOper.DropCollection<PortalUserEntity>();

//			var portalUserEntity = await UserCreations.CreatePortalUserEntity1(true, true);

//			await VisitedCountriesCreation.CreateVisitedCountryEntity1(portalUserEntity.id, true);
//			await VisitedCountriesCreation.CreateVisitedCountryEntity2(portalUserEntity.id, true);
//			await VisitedCountriesCreation.CreateVisitedCountryEntity4(portalUserEntity.id, true);

//			var newCountries = new List<VisitedCountryDO> { VisitedCountriesCreation.CreateVisitedCountry3(), VisitedCountriesCreation.CreateVisitedCountry2() };

//			var addedCountries = await CountriesDomain.AddNewCountriesAsync(newCountries, portalUserEntity.id.ToString());
//			//Assert.Equal(addedCountries.Count, 1);
//		}

//		//[Fact]
//		public async void should_not_find_a_new_country()
//		{
//			DBOper.DropCollection<VisitedCountryEntity>();
//			DBOper.DropCollection<PortalUserEntity>();

//			var portalUserEntity = await UserCreations.CreatePortalUserEntity1(true, true);

//			await VisitedCountriesCreation.CreateVisitedCountryEntity2(portalUserEntity.id, true);
//			await VisitedCountriesCreation.CreateVisitedCountryEntity3(portalUserEntity.id, true);

//			var newCountries = new List<VisitedCountryDO> { VisitedCountriesCreation.CreateVisitedCountry2(), VisitedCountriesCreation.CreateVisitedCountry3() };

//			var addedCountries = await CountriesDomain.AddNewCountriesAsync(newCountries, portalUserEntity.id.ToString());
//			//Assert.Empty(addedCountries);
//		}
//	}
//}