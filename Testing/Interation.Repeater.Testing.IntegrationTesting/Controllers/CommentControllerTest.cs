using Interation.Repeater.Api.Controllers;
using Interation.Repeater.IOC;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Interation.Repeater.Testing.IntegrationTesting.Controllers
{
    [TestClass]
    public class CommentControllerTest
    {
        CommentController _commentController;

        [TestInitialize]
        public void setup()
        {
            _commentController = InjectionRepository.Get<CommentController>();
        }

        [TestMethod]
        public void test_get_comment()
        {
            var viewModel = _commentController.Index("Product", 24);
        }
    }
}
