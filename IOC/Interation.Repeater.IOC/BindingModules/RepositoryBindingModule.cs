using Ninject.Modules;
using Interation.Repeater.Repository.IRepositoryProvider;
using Interation.Repeater.Repository.RepositoryImplementation;

namespace Interation.Repeater.IOC.BindingModules
{
    public class RepositoryBindingModule : NinjectModule
    {
        public override void Load()
        {
            Bind<ICommentRepository>().To<CommentRepository>().InSingletonScope();
            Bind<IProductRepository>().To<ProductRepository>().InSingletonScope();
            Bind<ITopicRepository>().To<TopicRepository>().InSingletonScope();
        }
    }
}
