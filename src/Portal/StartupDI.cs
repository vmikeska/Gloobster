using Autofac;
using Autofac.Builder;
using AzureBlobFileSystem;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.DomainModels.Services;
using Gloobster.DomainModels.Services.Accounts;
using Gloobster.DomainModels.Services.CountryService;
using Gloobster.DomainModels.Services.Facebook.FriendsExtractor;
using Gloobster.DomainModels.Services.Facebook.TaggedPlacesExtractor;
using Gloobster.DomainModels.Services.Foursquare;
using Gloobster.DomainModels.Services.GeonamesService;
using Gloobster.DomainModels.Services.Places;
using Gloobster.DomainModels.Services.PlaceSearch;
using Gloobster.DomainModels.Services.Trip;
using Gloobster.DomainModels.Services.Twitter;
using Gloobster.Enums;
using Gloobster.Sharing.Facebook;
using Gloobster.Sharing.Twitter;
using Gloobster.SocialLogin.Facebook.Communication;

namespace Gloobster.Portal
{
	public class AutofacModule : Module
	{
		protected override void Load(ContainerBuilder builder)
		{
			var storageCreation = new StorageCreation();			
			var storage = storageCreation.GetInstance(GloobsterConfig.IsLocal);
			builder.AddInstance<IStorageProvider>(storage);


			builder.AddTransient<IUserService, UserService>();
			builder.AddTransient<IAccountDriver, FacebookAccountDriver>().Keyed<IAccountDriver>("Facebook");
			builder.AddTransient<IAccountDriver, TwitterAccountDriver>().Keyed<IAccountDriver>("Twitter");
			builder.AddTransient<IAccountDriver, GoogleAccountDriver>().Keyed<IAccountDriver>("Google");
			builder.AddTransient<IAccountDriver, AccountDriver>().Keyed<IAccountDriver>("Base");

			builder.AddTransient<IVisitedPlacesDomain, VisitedPlacesDomain>();
			builder.AddTransient<IVisitedCitiesDomain, VisitedCitiesDomain>();
			builder.AddTransient<IVisitedCountriesDomain, VisitedCountriesDomain>();
			builder.AddTransient<IDbOperations, DbOperations>();
			builder.AddTransient<IFacebookService, FacebookService>();
			builder.AddTransient<IMyTwitterService, MyTwitterService>();
			builder.AddTransient<IFacebookTaggedPlacesExtractor, FacebookTaggedPlacesExtractor>();
			
            builder.AddInstance2<IAirportGroupService, AirportGroupService>();
			builder.AddInstance2<IAirportService, AirportService>();

			
			builder.AddTransient<IShareMapDomain, ShareMapDomain>();
			builder.AddTransient<ITripShareDomain, TripShareDomain>();
			builder.AddTransient<ITwitterShare, TwitterShare> ();
			builder.AddTransient <IFacebookShare, FacebookShare> ();

			builder.AddTransient<INotificationsDomain, NotificationsDomain>();
			builder.AddTransient<INotifications, Notifications>();
			

			builder.AddTransient<IPlanningDomain, PlanningDomain>();
			
            builder.AddTransient<IFriendsDomain, FriendsDomain>();
			builder.AddTransient<ITripPlannerDomain, TripPlannerDomain>();

			builder.AddTransient<IFilesDomain, FilesDomain>();

			builder.AddTransient<IPlacesExtractor, PlacesExtractor>();
			builder.AddTransient<ICreateUserData, CreateUserData>();
			

			builder.AddTransient<IPlacesExtractorDriver, TwitterPlacesDriver>().Keyed<IPlacesExtractorDriver>("Twitter");
			builder.AddTransient<IPlacesExtractorDriver, FacebookPlacesDriver>().Keyed<IPlacesExtractorDriver>("Facebook");

			builder.AddTransient<ISharedMapImageDomain, SharedMapImageDomain>(); 
			builder.AddTransient<IMapBoxImgCreator, MapBoxImgCreator>(); 
			builder.AddTransient<ITripInviteDomain, TripInviteDomain>();

			builder.AddInstance2<ISearchService, SearchService>();
			builder.AddInstance2<ISearchProvider, GeoNamesSearchProvider>().Keyed<ISearchProvider>(SourceType.City);
			builder.AddInstance2<ISearchProvider, CountrySearchProvider>().Keyed<ISearchProvider>(SourceType.Country);
			builder.AddInstance2<ISearchProvider, FacebookSearchProvider>().Keyed<ISearchProvider>(SourceType.FB);
			builder.AddInstance2<ISearchProvider, FoursquareSearchProvider>().Keyed<ISearchProvider>(SourceType.S4);

			builder.AddTransient<ICheckinPlaceDomain, CheckinPlaceDomain>();
			builder.AddTransient<IFacebookFriendsService, FacebookFriendsService>();

			//builder.AddInstance<IGeoNamesService>(new GeoNamesService());
			builder.AddInstance2<IGeoNamesService, GeoNamesService>();

			var foursquareService = new FoursquareService();
			foursquareService.Initialize(GloobsterConfig.FoursquareClientId, GloobsterConfig.FoursquareClientSecret);

			builder.AddInstance<IFoursquareService>(foursquareService);


			builder.AddInstance<ICountryService>(new CountryService());
		}
		
	}

	public static class Exts
	{
		public static IRegistrationBuilder<T, ConcreteReflectionActivatorData, SingleRegistrationStyle> AddTransient<I, T>(this ContainerBuilder builder) where T : new()
		{

			var reg = builder
					.RegisterType<T>()
				   .As<I>()
				   .PropertiesAutowired(PropertyWiringOptions.AllowCircularDependencies)
				   .InstancePerLifetimeScope();

			return reg;

			//builder
			//	.Register(c => new T())
			//	.As<I>()
			//	.InstancePerLifetimeScope();
		}

		public static IRegistrationBuilder<object, SimpleActivatorData, SingleRegistrationStyle> AddInstance<I>(this ContainerBuilder builder, object instance)
		{
			var reg = builder
				.Register(c => instance)
				.As<I>()
				.PropertiesAutowired(PropertyWiringOptions.AllowCircularDependencies)
				.SingleInstance();

			return reg;
		}

		public static IRegistrationBuilder<T, ConcreteReflectionActivatorData, SingleRegistrationStyle> AddInstance2<I, T>(this ContainerBuilder builder)
		{
			var reg = builder
				.RegisterType<T>()
				.As<I>()
				.PropertiesAutowired(PropertyWiringOptions.AllowCircularDependencies)
				.SingleInstance();

			return reg;
		}
	}
}
