﻿using System.Configuration;
using Gloobster.Common;
using Gloobster.DomainModelsCommon.User;
using Goobster.Portal.DomainModels;
using Goobster.Portal.Models;
using Goobster.Portal.Services;
using Microsoft.AspNet.Authentication.Facebook;
using Microsoft.AspNet.Authentication.MicrosoftAccount;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Diagnostics;
using Microsoft.AspNet.Diagnostics.Entity;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Framework.Configuration;
using Microsoft.Framework.DependencyInjection;
using Microsoft.Framework.Logging;
using Microsoft.Framework.OptionsModel;
using Microsoft.Framework.Runtime;

namespace Goobster.Portal
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
            RegisterDomainModels(services);

            //todo: solve this automatic resolving issue
            DbOperations.Configuration = Configuration;

            services.AddTransient<IDbOperations, DbOperations>();
            
            // Add MVC services to the services container.
            services.AddMvc();


            // Register application services.
            services.AddTransient<IEmailSender, AuthMessageSender>();
            services.AddTransient<ISmsSender, AuthMessageSender>();
        }

        private void RegisterDomainModels(IServiceCollection services)
        {
            services.AddTransient<IPortalUserDomain, PortalUserDomain>();


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

            // Uncomment the following line to add Web API services which makes it easier to port Web API 2 controllers.
            // You will also need to add the Microsoft.AspNet.Mvc.WebApiCompatShim package to the 'dependencies' section of project.json.
            //services.AddWebApiConventions();

   // Add authentication middleware to the request pipeline. You can configure options such as Id and Secret in the ConfigureServices method.
            // For more information see http://go.microsoft.com/fwlink/?LinkID=532715

// Add Entity Framework services to the services container.
//services.AddEntityFramework()
//    .AddSqlServer()
//    .AddDbContext<ApplicationDbContext>(options =>
//        options.UseSqlServer(Configuration["Data:DefaultConnection:ConnectionString"]));

// Add Identity services to the services container.
//services.AddIdentity<ApplicationUser, IdentityRole>()
//    .AddEntityFrameworkStores<ApplicationDbContext>()
//    .AddDefaultTokenProviders();

// Configure the options for the authentication middleware.
// You can add options for Google, Twitter and other middleware as shown below.
// For more information see http://go.microsoft.com/fwlink/?LinkID=532715
//services.Configure<FacebookAuthenticationOptions>(options =>
//{
//    options.AppId = Configuration["Authentication:Facebook:AppId"];
//    options.AppSecret = Configuration["Authentication:Facebook:AppSecret"];
//});

//services.Configure<MicrosoftAccountAuthenticationOptions>(options =>
//{
//    options.ClientId = Configuration["Authentication:MicrosoftAccount:ClientId"];
//    options.ClientSecret = Configuration["Authentication:MicrosoftAccount:ClientSecret"];
//}); 

    
    
    //loggerFactory.MinimumLevel = LogLevel.Information;
            //loggerFactory.AddConsole();
            

            //// Add the following to the request pipeline only in development environment.
            //if (env.IsDevelopment())
            //{
            //    app.UseBrowserLink();
            //    app.UseErrorPage(ErrorPageOptions.ShowAll);
            //    app.UseDatabaseErrorPage    (DatabaseErrorPageOptions.ShowAll);
            //}
            //else
            //{
            //    // Add Error handling middleware which catches all application specific errors and
            //    // sends the request to the following path or controller action.
            //    app.UseErrorHandler("/Home/Error");
            //}

            // Add static files to the request pipeline.