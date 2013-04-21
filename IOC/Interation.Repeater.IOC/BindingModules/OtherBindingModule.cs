using System.Web.Mvc;
using Ninject.Modules;

namespace Interation.Repeater.IOC.BindingModules
{
    public class OtherBindingModule : NinjectModule
    {
        public override void Load()
        {
            Bind<ControllerActionInvoker>().To<InjectionActionInvoker>().InSingletonScope();
        }
    }
}
