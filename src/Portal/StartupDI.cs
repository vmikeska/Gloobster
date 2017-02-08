using Autofac;
using Autofac.Builder;
using AzureBlobFileSystem;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainInterfaces.SearchEngine8;
using Gloobster.DomainInterfaces.UserLogs;
using Gloobster.DomainModels;
using Gloobster.DomainModels.ImageDB;
using Gloobster.DomainModels.Langs;
using Gloobster.DomainModels.SearchEngine;
using Gloobster.DomainModels.SearchEngine8;
using Gloobster.DomainModels.SearchEngine8.Executing;
using Gloobster.DomainModels.SearchEngine8.Queuing;
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
using Gloobster.DomainModels.UserLog;
using Gloobster.DomainModels.Wiki;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Api.PinBoard;
using Gloobster.Portal.Controllers.Portal;
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

            
            builder.AddTransient<IVisitedEntityRequestor, VisitedEntityRequestor>();

            builder.AddTransient<INewAccountCreator, NewAccountCreator>();
            
            builder.AddTransient<IVisitedPlacesDomain, VisitedPlacesDomain>();
			builder.AddTransient<IVisitedCitiesDomain, VisitedCitiesDomain>();
			builder.AddTransient<IVisitedCountriesDomain, VisitedCountriesDomain>();
			builder.AddTransient<IDbOperations, DbOperations>();
			builder.AddTransient<IFacebookService, FacebookService>();
			builder.AddTransient<IMyTwitterService, MyTwitterService>();
			builder.AddTransient<IFacebookTaggedPlacesExtractor, FacebookTaggedPlacesExtractor>();
            builder.AddTransient<IVisitedAggregationDomain, VisitedAggregationDomain>();
            builder.AddTransient<IVisitedStatesDomain, VisitedStatesDomain>();
            
            builder.AddInstance2<IAirportGroupService, AirportGroupService>();
			builder.AddInstance2<IAirportService, AirportService>();

            builder.AddTransient<ITripPermissionsDomain, TripPermissionsDomain>();
            
            builder.AddTransient<IShareMapDomain, ShareMapDomain>();
			builder.AddTransient<ITripShareDomain, TripShareDomain>();
			builder.AddTransient<ITwitterShare, TwitterShare> ();
			builder.AddTransient <IFacebookShare, FacebookShare> ();

			builder.AddTransient<INotificationsDomain, NotificationsDomain>();
			builder.AddTransient<INotifications, Notifications>();

            builder.AddTransient<IPinBoardStatRequestCreator, PinBoardStatRequestCreator>();

            builder.AddTransient<DomainInterfaces.ITripDomain, DomainModels.Services.Trip.TripDomain>();
            builder.AddTransient<ITripWaypointsDomain, TripWaypointsDomain>();
            
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
            builder.AddInstance2<ISearchProvider, YelpSearchProvider>().Keyed<ISearchProvider>(SourceType.Yelp);

            builder.AddInstance2<IYelpSearchService, YelpSearchService>();
            
            builder.AddTransient<ICheckinPlaceDomain, CheckinPlaceDomain>();
			builder.AddTransient<IFacebookFriendsService, FacebookFriendsService>();

            builder.AddTransient<IImgDbDomain, ImgDbDomain>();
            
            //builder.AddInstance<IGeoNamesService>(new GeoNamesService());
            builder.AddInstance2<IGeoNamesService, GeoNamesService>();

			var foursquareService = new FoursquareService();
			foursquareService.Initialize(GloobsterConfig.FoursquareClientId, GloobsterConfig.FoursquareClientSecret);

			builder.AddInstance<IFoursquareService>(foursquareService);
            
            builder.AddTransient<IGeoNamesOnlineService, GeoNamesOnlineService>();

            builder.AddTransient<ICustomSearchDomain, CustomSearchDomain>();
            
            var langs = new Languages
            {
                DB = new DbOperations()
            };
            
            builder.AddInstance<ILanguages>(langs);

            builder.AddInstance<ICountryService>(new CountryService());
            builder.AddTransient<IInitialWikiDataCreator, InitialWikiDataCreator>();

		    var perm = new WikiPermissions
		    {
		        DB = new DbOperations()
		    };
            perm.RefreshPermissions();
            builder.AddInstance<IWikiPermissions>(perm);

            builder.AddTransient<IWikiUpdateDomain, WikiUpdateDomain>();
            builder.AddTransient<IWikiArticleDomain, WikiArticleDomain>();            
            builder.AddTransient<IWikiChangeDomain, WikiChangeDomain>();
            builder.AddTransient<IContentEvaluator, ContentEvaluator>();
            builder.AddTransient<INiceLinkBuilder, NiceLinkBuilder>();
            builder.AddTransient<IWikiAdminTasks, WikiAdminTasks>();

            builder.AddTransient<IArticlePhoto, ArticlePhoto>();
            builder.AddTransient<IWikiReportDomain, WikiReportDomain>();

            builder.AddTransient<IExecOperation, ConfirmPhotoOperation>().Keyed<IExecOperation>("ConfirmPhotoOperation");
            builder.AddTransient<IExecOperation, DeletePhotoOperation>().Keyed<IExecOperation>("DeletePhotoOperation");
            builder.AddTransient<IExecOperation, SetToResolvedOperation>().Keyed<IExecOperation>("SetToResolvedOperation");

            builder.AddTransient<ITripDomain, TripDomain>();
            
            builder.AddTransient<ISocNetworkService, SocNetworkService>();
            builder.AddTransient<ISocLogin, FacebookSocLogin>().Keyed<ISocLogin>("Facebook");
            builder.AddTransient<ISocLogin, GoogleSocLogin>().Keyed<ISocLogin>("Google");
            builder.AddTransient<ISocLogin, TwitterSocLogin>().Keyed<ISocLogin>("Twitter");
            
            builder.AddTransient<IAccountDomain, AccountDomain>();
            builder.AddTransient<IAvatarPhoto, AvatarPhoto>();

            builder.AddTransient<IPinboardImportDomain, PinboardImportDomain>();
            builder.AddTransient<IPinBoardStats, PinBoardStats>();


                   
		    builder.AddTransient<IFlightScoreEngine, FlightScoreEngine>();

            

            var airportsCache = new NewAirportCache
		    {
		        DB = new DbOperations()
		    };

		    NewAirportCache.Airports = airportsCache.DB.List<NewAirportEntity>(n => !string.IsNullOrEmpty(n.Name));
            
            builder.AddInstance<INewAirportCache>(airportsCache);


		    var oldAirCache = new AirportCache();
            oldAirCache.Init(new DbOperations());
            builder.AddInstance<IAirportCache>(oldAirCache);


		    var newAirCityCache = new NewAirportCityCache();
            newAirCityCache.Init(new DbOperations());
            builder.AddInstance<INewAirportCityCache>(newAirCityCache);
            

            builder.AddTransient<IFlightsDb, FlightsDb>();
            builder.AddTransient<IRequestBuilder8, RequestBuilder8>();
            builder.AddTransient<IRequestsBuilder8, RequestsBuilder8>();
            builder.AddTransient<IClientRequestExecutor, ClientRequestExecutor>();

            builder.AddTransient<IFlightsBigDataCalculator, FlightsBigDataCalculator>();
            builder.AddTransient<IKiwiResultsExecutor, KiwiResultsExecutor>();
            builder.AddTransient<IKiwiResultsProcessor, KiwiResultsProcessor>();
            builder.AddTransient<IQueriesExecutor, QueriesExecutor>();


            builder.AddTransient<ITripUserLog, TripUserLog>();
            builder.AddTransient<IPinsUserLog, PinsUserLog>();
            builder.AddTransient<IFriendsUserLog, FriendsUserLog>();

            









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
