using Gloobster.Common;
using Gloobster.DomainModels;
using Gloobster.DomainModels.Services.CountryService;
using Gloobster.DomainModels.Services.Facebook.TaggedPlacesExtractor;
using Gloobster.DomainModels.Services.GeonamesService;
using Gloobster.DomainModelsCommon.Interfaces;
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
        public void ConfigureServices(IServiceCollection services)
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
			
			RegisterApplicationStuff(services);
			
			

			// Add MVC services to the services container.
			services.AddMvc();
		}

		private void RegisterApplicationStuff(IServiceCollection services)
		{
			services.AddTransient<IPortalUserDomain, PortalUserDomain>();
			services.AddTransient<IFacebookUserDomain, FacebookUserDomain>();
			services.AddTransient<IVisitedPlacesDomain, VisitedPlacesDomain>();
			services.AddTransient<IVisitedCountriesDomain, VisitedCountriesDomain>();
			
			services.AddTransient<IDbOperations, DbOperations>();
			services.AddTransient<IFacebookService, FacebookService>();

			services.AddTransient<IFacebookTaggedPlacesExtractor, FacebookTaggedPlacesExtractor>();

			services.AddInstance<ICountryService>(new CountryService());

			services.AddTransient<IGeoNamesService, GeoNamesService>();


		}

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
}
