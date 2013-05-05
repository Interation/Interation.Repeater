using Ninject.Modules;
using Interation.Repeater.Service.IServiceProvider;
using Interation.Repeater.Service.ServiceImplementation;

namespace Interation.Repeater.IOC.BindingModules
{
    public class ServiceBindingModule : NinjectModule
    {
        public override void Load()
        {
            Bind<ICommentService>().To<CommentService>().InSingletonScope();
            Bind<IProductService>().To<ProductService>().InSingletonScope();
            Bind<ITopicService>().To<TopicService>().InSingletonScope();
        }
    }
}
