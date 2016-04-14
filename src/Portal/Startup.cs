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
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels.Langs;
using Gloobster.Entities;
using MongoDB.Bson;

namespace Gloobster.Portal
{    
    public class Startup
    {
		public IConfiguration Configuration { get; set; }
        public static Serilog.ILogger Logger;

        public static Languages Langs;

        public static void AddDebugLog(string txt)
        {
            Logger?.Debug(txt);
        }

        public Startup(IHostingEnvironment env)
		{
            //.AddJsonFile("configLocal.json");
            //.AddJsonFile($"config.{env.EnvironmentName}.json", optional: true);

            try
            {
		        //http://stackoverflow.com/questions/28258227/how-to-set-ihostingenvironment-environmentname-in-vnext-application
		        // Setup configuration sources.			
		        var builder = new ConfigurationBuilder();

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
                    Logger = Log.Logger;
                    AddDebugLog("LogglyInited");
                    AddDebugLog("IsProduction");
                }
                
                if (env.IsDevelopment())
		        {
		            builder.AddJsonFile("configLocal.json");

                    // This reads the configuration keys from the secret store.
                    // For more details on using the user secret store see http://go.microsoft.com/fwlink/?LinkID=532709
                    builder.AddUserSecrets();
                }
                
		        builder.AddEnvironmentVariables();
		        Configuration = builder.Build();

                AddDebugLog("Startup:Finished");
		    }
		    catch (Exception exc)
		    {
		        AddDebugLog(exc.Message);
		    }
		}
		
		// This method gets called by the runtime. Use this method to add services to the container.
		public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            try
            {
                AddDebugLog("ConfigureServices:Enter");

                LoadConfigFile();
		        InitDB();
            
                services.AddMvc();
			    services.AddSession();
			    services.AddCaching();

			    var serviceProvider = InitalizeAutofac(services);
                AddDebugLog("ConfigureServices:Finished");
                
                return serviceProvider;
            }
            catch (Exception exc)
            {
                AddDebugLog(exc.Message);
            }

		    return null;
        }

	    private async void InitDB()
	    {
	        try
	        {
                AddDebugLog("InitDB:Enter");

	            var db = new DbOperations();
                
                await db.CreateCollection<VisitedCountryAggregatedEntity>();
                await db.CreateCollection<VisitedCityAggregatedEntity>();
                await db.CreateCollection<VisitedPlaceAggregatedEntity>();

	            


                AddDebugLog("InitDB:Leave");
	        }
	        catch (Exception exc)
	        {
	            AddDebugLog(exc.Message);
	        }
	    }

	    // Configure is called after ConfigureServices is called.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
		{
            //http://derpturkey.com/asp-net-5-custom-middlware/
            try
            {
                AddDebugLog("Configure:Enter");

		        app.UseSession();


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


		        app.UseStaticFiles();

		        // To configure external authentication please see http://go.microsoft.com/fwlink/?LinkID=532715
		        app.UseMvc(routes =>
		        {
		            routes.MapRoute(
		                name: "default",
		                template: "{controller=Home}/{action=Index}/{id?}");

                    routes.MapRoute(
                        name: "wikiHome",
                        template: "wiki",
                        defaults: new { controller = "Wiki", action = "Home" }
                        );

                    routes.MapRoute(
		                name: "wikiShort",
		                template: "wiki/{id}",
		                defaults: new {controller = "Wiki", action = "Page"}
		                );

		            routes.MapRoute(
		                name: "wikiFull",
		                template: "wiki/{lang}/{id}",
		                defaults: new {controller = "Wiki", action = "PageRegular"}
		                );

		            routes.MapRoute(
		                name: "sitemap",
		                template: "sitemap",
		                defaults: new {controller = "SiteMap", action = "Sitemap"}
		                );


		        });
                AddDebugLog("Configure:Leave");
		    }
		    catch (Exception exc)
		    {
		        AddDebugLog(exc.Message);
		    }
		}

		// Entry point for the application.
        public static void Main(string[] args) => Run(args);

        private static void Run(string[] args)
        {
            AddDebugLog("Run:Enter");
            WebApplication.Run<Startup>(args);
            AddDebugLog("Run:Leave");
            
        }



        private IServiceProvider InitalizeAutofac(IServiceCollection services)
		{
		    try
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
		    catch (Exception exc)
		    {
		        AddDebugLog(exc.Message);
		    }

		    return null;
		}

		private void LoadConfigFile()
		{
		    try
		    {

		        GloobsterConfig.MongoConnectionString = Configuration["Data:DefaultConnection:ConnectionString"];
		        GloobsterConfig.DatabaseName = Configuration["Data:DefaultConnection:DatabaseName"];

		        GloobsterConfig.Domain = Configuration["Environment:Domain"];
		        GloobsterConfig.IsLocal = bool.Parse(Configuration["Environment:IsLocal"]);
		        GloobsterConfig.Protocol = Configuration["Environment:Protocol"];

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

                GloobsterConfig.GoogleClientId = Configuration["Google:ClientId"];
            

            }
		    catch (Exception exc)
		    {
		        AddDebugLog(exc.Message);
		    }
		}

	}


}
