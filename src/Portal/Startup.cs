using System;
using Autofac;
using Gloobster.Common;
using Serilog;
using Loggly.Config;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using AutofacSerilogIntegration;
using Autofac.Extensions.DependencyInjection;
using Gloobster.Database;
using Gloobster.Entities;

namespace Gloobster.Portal
{
	public class Startup
    {
		public IConfiguration Configuration { get; set; }

		public Startup(IHostingEnvironment env)
		{
			//http://stackoverflow.com/questions/28258227/how-to-set-ihostingenvironment-environmentname-in-vnext-application
			// Setup configuration sources.			
			var builder = new ConfigurationBuilder();

	        if (env.IsDevelopment())
	        {
				builder.AddJsonFile("configLocal.json");
			}

			if (env.IsProduction())
			{
				builder.AddJsonFile("configRemote.json");
				
				Log.Logger = new LoggerConfiguration()
				.MinimumLevel.Debug()
				.WriteTo.Loggly()
				.CreateLogger();
				//https://github.com/neutmute/loggly-csharp
				LogglyConfig.Instance.ApplicationName = "gloobster";
				LogglyConfig.Instance.CustomerToken = "5be61d53-19c9-4e23-ad50-1300065b591a";
				LogglyConfig.Instance.Transport = new TransportConfiguration
				{
					EndpointHostname = "logs-01.loggly.com",
					EndpointPort = 443,
					LogTransport = LogTransport.Https
				};
				LogglyConfig.Instance.ThrowExceptions = true;				
			}
			
			//.AddJsonFile("configLocal.json");
			//.AddJsonFile($"config.{env.EnvironmentName}.json", optional: true);

			if (env.IsDevelopment())
            {
                // This reads the configuration keys from the secret store.
                // For more details on using the user secret store see http://go.microsoft.com/fwlink/?LinkID=532709
                builder.AddUserSecrets();
            }
            builder.AddEnvironmentVariables();
            Configuration = builder.Build();			
        }
		
		// This method gets called by the runtime. Use this method to add services to the container.
		public IServiceProvider ConfigureServices(IServiceCollection services)
        {
	        LoadConfigFile();
		    InitDB();
            
            services.AddMvc();
			services.AddSession();
			services.AddCaching();

			var serviceProvider = InitalizeAutofac(services);
	        return serviceProvider;
        }

	    private void InitDB()
	    {
            var db = new DbOperations();
	        
	        db.CreateCollection<VisitedCountryAggregatedEntity>();
            db.CreateCollection<VisitedCityAggregatedEntity>();
            db.CreateCollection<VisitedPlaceAggregatedEntity>();
        }

	    // Configure is called after ConfigureServices is called.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
		{
			loggerFactory.AddSerilog();

			//var logging = Configuration.GetSection("Logging");
			//loggerFactory.AddConsole(logging);
			//loggerFactory.AddDebug();

			if (env.IsDevelopment())
			{
				app.UseBrowserLink();
				app.UseDeveloperExceptionPage();
				app.UseDatabaseErrorPage();
			}
			else
			{
				app.UseExceptionHandler("/Home/Error");
			}

			app.UseIISPlatformHandler(options => options.AuthenticationDescriptions.Clear());

			app.UseSession();
			app.UseStaticFiles();
			
			// To configure external authentication please see http://go.microsoft.com/fwlink/?LinkID=532715
			app.UseMvc(routes =>
			{
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapRoute(
			        name: "wikiShort",
			        template: "wiki/{id}",
                    defaults: new { controller = "Wiki", action = "Page" }
                    );

                routes.MapRoute(
                    name: "wikiFull",
                    template: "wiki/{lang}/{id}",
                    defaults: new { controller = "Wiki", action = "PageRegular" }
                    );
            });
		}

		// Entry point for the application.
		public static void Main(string[] args) => WebApplication.Run<Startup>(args);



		private IServiceProvider InitalizeAutofac(IServiceCollection services)
		{
			var builder = new ContainerBuilder();
			
			//https://github.com/nblumhardt/autofac-serilog-integration
			builder.RegisterLogger();
			
			// Add any Autofac modules or registrations.
			builder.RegisterModule(new AutofacModule());
			// Populate the services.			
			builder.Populate(services);			
			// Build the container.
			var container = builder.Build();
			// Resolve and return the service provider.
			return container.Resolve<IServiceProvider>();
		}

		private void LoadConfigFile()
		{
			GloobsterConfig.MongoConnectionString = Configuration["Data:DefaultConnection:ConnectionString"];
			GloobsterConfig.DatabaseName = Configuration["Data:DefaultConnection:DatabaseName"];
			GloobsterConfig.Domain = Configuration["Environment:Domain"];
			GloobsterConfig.IsLocal = bool.Parse(Configuration["Environment:IsLocal"]);

			GloobsterConfig.AppSecret = Configuration["AppSecret"];

			GloobsterConfig.FacebookAppId = Configuration["Facebook:AppId"];
			GloobsterConfig.FacebookAppSecret = Configuration["Facebook:AppSecret"];

			GloobsterConfig.TwitterConsumerKey = Configuration["Twitter:ConsumerKey"];
			GloobsterConfig.TwitterConsumerSecret = Configuration["Twitter:ConsumerSecret"];
			GloobsterConfig.TwitterAccessToken = Configuration["Twitter:AccessToken"];
			GloobsterConfig.TwitterAccessTokenSecret = Configuration["Twitter:AccessTokenSecret"];

			GloobsterConfig.FoursquareClientId = Configuration["Foursquare:ClientId"];
			GloobsterConfig.FoursquareClientSecret = Configuration["Foursquare:ClientSecret"];

			GloobsterConfig.MapBoxSecret = Configuration["Mapbox:Secret"];

			GloobsterConfig.StorageConnectionString = Configuration["Storage:ConnectionString"];
			GloobsterConfig.StorageRootDir = Configuration["Storage:RootDir"];

            GloobsterConfig.YelpAccessToken = Configuration["Yelp:AccessToken"];
            GloobsterConfig.YelpConsumerKey = Configuration["Yelp:ConsumerKey"];
            GloobsterConfig.YelpAccessTokenSecret = Configuration["Yelp:AccessTokenSecret"];
            GloobsterConfig.YelpConsumerSecret = Configuration["Yelp:ConsumerSecret"];
        }

	}


}
