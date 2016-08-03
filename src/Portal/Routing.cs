using Gloobster.Common;
using Microsoft.AspNet.Builder;

namespace Gloobster.Portal
{
    public class Routing
    {
        public static void Configure(IApplicationBuilder app)
        {
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapRoute(
                    name: "pinsLink",
                    template: "tm",
                    defaults: new { controller = "Pinboard", action = "Pins" }
                    );

                routes.MapRoute(
                    name: "travelmap",
                    template: RoutingConsts.PinsMenuName,
                    defaults: new { controller = "Pinboard", action = "Pins" }
                    );

                routes.MapRoute(
                    name: "travelplanner",
                    template: RoutingConsts.PlannerMenuName + "/{id}",
                    defaults: new { controller = "trip", action = "list" }
                    );

                routes.MapRoute(
                    name: "TripOverview",
                    template: RoutingConsts.TripMenuName + "/{id}",
                    defaults: new { controller = "trip", action = "overview" }
                    );

                routes.MapRoute(
                    name: "TripDetail",
                    template: RoutingConsts.TripEditMenuName + "/{id}",
                    defaults: new { controller = "trip", action = "detail" }
                    );



                routes.MapRoute(
                    name: "wikiHome",
                    template: RoutingConsts.WikiMenuName,
                    defaults: new { controller = "Wiki", action = "Home" }
                    );

                routes.MapRoute(
                    name: "notifs",
                    template: RoutingConsts.NotifsMenuName,
                    defaults: new { controller = "PortalUser", action = "Notifications" }
                    );

                routes.MapRoute(
                    name: "userDetail",
                    template: RoutingConsts.UserDetailMenuName,
                    defaults: new { controller = "PortalUser", action = "Settings" }
                    );

                routes.MapRoute(
                    name: "friends",
                    template: RoutingConsts.FriendsMenuName,
                    defaults: new { controller = "Friends", action = "List" }
                    );

                routes.MapRoute(
                    name: "wikiShort",
                    template: RoutingConsts.WikiMenuName + "/{id}",
                    defaults: new { controller = "Wiki", action = "Page" }
                    );

                routes.MapRoute(
                    name: "wikiFull",
                    template: RoutingConsts.WikiMenuName + "/{lang}/{id}",
                    defaults: new { controller = "Wiki", action = "PageRegular" }
                    );

                routes.MapRoute(
                    name: "sitemap",
                    template: "sitemap",
                    defaults: new { controller = "SiteMap", action = "Sitemap" }
                    );


            });
        }
    }
}