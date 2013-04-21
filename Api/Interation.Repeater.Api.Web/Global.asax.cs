using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using Interation.Repeater.IOC;

namespace Interation.Repeater.Api.Web
{
    public class MvcApplication : InjectionHttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            Register(GlobalConfiguration.Configuration);
            RegisterGlobalFilters(GlobalFilters.Filters);
            RegisterRoutes(RouteTable.Routes);
        }

        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }

        public void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }

        public void Register(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}