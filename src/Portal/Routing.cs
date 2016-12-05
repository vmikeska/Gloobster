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
                    name: "imageDB",
                    template: "Pic/{id}/{cut}",
                    defaults: new { controller = "ImageDB", action = "Pic" }
                    );
                
                routes.MapRoute(
                    name: "imageDB_def",
                    template: "Picd/{id}/{cut}",
                    defaults: new { controller = "ImageDB", action = "Picd" }
                    );

                routes.MapRoute(
                    name: "messages",
                    template: "messages",
                    defaults: new { controller = "Message", action = "Home" }
                    );

                routes.MapRoute(
                    name: "message",
                    template: "message/{id}",
                    defaults: new { controller = "Message", action = "Message" }
                    );

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
                    name: "travelbuddy",
                    template: RoutingConsts.TravelBuddyMenuName,
                    defaults: new { controller = "travelb", action = "home" }
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
                    name: "Deals",
                    template: RoutingConsts.DealsMenuName,
                    defaults: new { controller = "deals", action = "home" }
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
                    name: "userSettings",
                    template: RoutingConsts.UserDetailMenuName,
                    defaults: new { controller = "PortalUser", action = "Settings" }
                    );

                routes.MapRoute(
                    name: "userDetial",
                    template: RoutingConsts.UserDetailMenuName + "/{id}",
                    defaults: new { controller = "PortalUser", action = "Detail" }
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