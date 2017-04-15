using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Gloobster.CitiesService
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            // Set up configuration sources.
            var builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddEnvironmentVariables();
            Configuration = builder.Build();            
        }

        public IConfigurationRoot Configuration { get; set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(o => o.AddPolicy("AllowAll", p => p.AllowAnyOrigin()
                                                                        .AllowAnyMethod()
                                                                         .AllowAnyHeader()));

            // Add framework services.
            services.AddMvc();

			services.AddSingleton<ICitiesDB>(a =>
			{
				var citiesDB = new CitiesDB();
				citiesDB.InitializeData();
				return citiesDB;
			});
		}

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            app.UseCors("AllowAll");

            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            app.UseIISPlatformHandler();

            app.UseStaticFiles();

			app.UseMvc();
            
        }

        // Entry point for the application.
        public static void Main(string[] args)
        {
			

			WebApplication.Run<Startup>(args);
        }
    }
}
