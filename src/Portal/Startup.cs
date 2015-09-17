using System;
using Autofac;
using Autofac.Framework.DependencyInjection;
using Gloobster.Common;
using Gloobster.DomainModels;
using Gloobster.DomainModels.Services.Accounts;
using Gloobster.DomainModels.Services.CountryService;
using Gloobster.DomainModels.Services.Facebook.TaggedPlacesExtractor;
using Gloobster.DomainModels.Services.GeonamesService;
using Gloobster.DomainModels.Services.Twitter;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.Portal.Controllers;
using Gloobster.SocialLogin.Facebook.Communication;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.Dnx.Runtime;
using Microsoft.Framework.Configuration;
using Microsoft.Framework.DependencyInjection;
using Microsoft.Framework.Logging;

namespace Gloobster.Portal
{
	public class Startup
    {
        public Startup(IHostingEnvironment env, IApplicationEnvironment appEnv)
        {
            // Setup configuration sources.

            var builder = new ConfigurationBuilder(appEnv.ApplicationBasePath)
                .AddJsonFile("config.json")
                .AddJsonFile($"config.{env.EnvironmentName}.json", optional: true);

            if (env.IsDevelopment())
            {
                // This reads the configuration keys from the secret store.
                // For more details on using the user secret store see http://go.microsoft.com/fwlink/?LinkID=532709
                builder.AddUserSecrets();
            }
            builder.AddEnvironmentVariables();
            Configuration = builder.Build();

			
        }

        public IConfiguration Configuration { get; set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
	        LoadConfigFile();
			services.AddMvc();

	        var serviceProvider = InitalizeAutofac(services);
	        return serviceProvider;
        }

		private IServiceProvider InitalizeAutofac(IServiceCollection services)
		{
			var builder = new ContainerBuilder();
			// Add any Autofac modules or registrations.
			builder.RegisterModule(new AutofacModule());
			// Populate the services.
			//builder.Populate(services);
			builder.Populate(services);
			// Build the container.
			var container = builder.Build();
			// Resolve and return the service provider.
			return container.Resolve<IServiceProvider>();
		}

		private void LoadConfigFile()
		{
			//var config = new GloobsterConfig
			//{
			//	MongoConnectionString = Configuration["Data:DefaultConnection:ConnectionString"],
			//	DatabaseName = Configuration["Data:DefaultConnection:DatabaseName"],
			//	AppSecret = Configuration["AppSecret"]
			//};

			//services.AddInstance<IGloobsterConfig>(config);

			GloobsterConfig.MongoConnectionString = Configuration["Data:DefaultConnection:ConnectionString"];
			GloobsterConfig.DatabaseName = Configuration["Data:DefaultConnection:DatabaseName"];
			GloobsterConfig.AppSecret = Configuration["AppSecret"];

			GloobsterConfig.FacebookAppId = Configuration["Facebook:AppId"];
			GloobsterConfig.FacebookAppSecret = Configuration["Facebook:AppSecret"];

			GloobsterConfig.TwitterConsumerKey = Configuration["Twitter:ConsumerKey"];
			GloobsterConfig.TwitterConsumerSecret = Configuration["Twitter:ConsumerSecret"];
			GloobsterConfig.TwitterAccessToken = Configuration["Twitter:AccessToken"];
			GloobsterConfig.TwitterAccessTokenSecret = Configuration["Twitter:AccessTokenSecret"];

		}

		//private void RegisterApplicationStuff(IServiceCollection services)
		//{
		//	services.AddTransient<IUserService, UserService>(); 
			
			
		//	services.AddTransient<IVisitedPlacesDomain, VisitedPlacesDomain>();
		//	services.AddTransient<IVisitedCountriesDomain, VisitedCountriesDomain>();
			
		//	services.AddTransient<IDbOperations, DbOperations>();

		//	services.AddTransient<IFacebookService, FacebookService>();
		//	services.AddTransient<IMyTwitterService, MyTwitterService>();

		//	services.AddTransient<IFacebookTaggedPlacesExtractor, FacebookTaggedPlacesExtractor>();

		//	services.AddInstance<ICountryService>(new CountryService());

		//	services.AddTransient<IGeoNamesService, GeoNamesService>();

		//	services.AddTransient<IFacebookDomain, FacebookDomain>();
		//}

		// Configure is called after ConfigureServices is called.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
			app.UseStaticFiles();

			// Add MVC to the request pipeline.
			app.UseMvc(routes =>
			{
				routes.MapRoute(
					name: "default",
					template: "{controller=Home}/{action=Index}/{id?}");
			});
		}
    }

	public class AutofacModule : Module
	{
		protected override void Load(ContainerBuilder builder)
		{
			builder.AddTransient<IFacebookDomain, FacebookDomain>();				
			builder.AddTransient<IUserService, UserService>();
			builder.AddTransient<IVisitedPlacesDomain, VisitedPlacesDomain>();
			builder.AddTransient<IVisitedCountriesDomain, VisitedCountriesDomain>();
			builder.AddTransient<IDbOperations, DbOperations>();
			builder.AddTransient<IFacebookService, FacebookService>();
			builder.AddTransient<IMyTwitterService, MyTwitterService>();
			builder.AddTransient<IFacebookTaggedPlacesExtractor, FacebookTaggedPlacesExtractor>();
			builder.AddTransient<IGeoNamesService, GeoNamesService>();
			
			builder.AddInstance<ICountryService>(new CountryService());
		}		
	}

	public static class Exts
	{
		public static void AddTransient<I, T>(this ContainerBuilder builder) where T : new()
		{

			builder.RegisterType<T>()
				   .As<I>()
				   .PropertiesAutowired(PropertyWiringOptions.AllowCircularDependencies)
				   .InstancePerLifetimeScope();

			//builder
			//	.Register(c => new T())
			//	.As<I>()
			//	.InstancePerLifetimeScope();
		}

		public static void AddInstance<I>(this ContainerBuilder builder, object instance)
		{
			builder
				.Register(c => instance)
				.As<I>()
				.SingleInstance();
		}
	}
}
