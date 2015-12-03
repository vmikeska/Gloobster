﻿using System;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Gloobster.Common;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;



namespace Gloobster.Portal
{
	public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
			// Setup configuration sources.			
			var builder = new ConfigurationBuilder()
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
			services.AddSession();
			services.AddCaching();

			var serviceProvider = InitalizeAutofac(services);
	        return serviceProvider;
        }
		
		// Configure is called after ConfigureServices is called.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
			//var listener = app.ServerFeatures.Get<WebListener>();
			//if (listener != null)
			//{
			//	listener.AuthenticationManager.AuthenticationSchemes = AuthenticationSchemes.None;
			//}

			loggerFactory.AddConsole(Configuration.GetSection("Logging"));
			loggerFactory.AddDebug();

			if (env.IsDevelopment())
			{
				app.UseBrowserLink();
				app.UseDeveloperExceptionPage();
				app.UseDatabaseErrorPage();
			}
			else
			{
				app.UseExceptionHandler("/Home/Error");

				// For more details on creating database during deployment see http://go.microsoft.com/fwlink/?LinkID=615859
				//try
				//{
				//	using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
				//	{
				//		serviceScope.ServiceProvider.GetService<ApplicationDbContext>()
				//			 .Database.Migrate();
				//	}
				//}
				//catch { }
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
			});
		}

		// Entry point for the application.
		public static void Main(string[] args) => WebApplication.Run<Startup>(args);



		private IServiceProvider InitalizeAutofac(IServiceCollection services)
		{
			var builder = new ContainerBuilder();
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

			GloobsterConfig.FoursquareClientId = Configuration["Foursquare:ClientId"];
			GloobsterConfig.FoursquareClientSecret = Configuration["Foursquare:ClientSecret"];

		}

	}


}
