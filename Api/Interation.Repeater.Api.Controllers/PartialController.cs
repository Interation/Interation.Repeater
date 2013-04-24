using System.Collections.Generic;
using System.Web.Mvc;
using Interation.Repeater.Api.ViewModel;
using Interation.Repeater.Service.Contract;
using Interation.Repeater.Service.IServiceProvider;

namespace Interation.Repeater.Api.Controllers
{
    public class PartialController : Controller
    {
        IProductService _productService;
        ITopicService _topicService;

        public PartialController(IProductService productService, ITopicService topicService)
        {
            _productService = productService;
            _topicService = topicService;
        }

        public JsonResult Featured(string version)
        {
            var topicContracts = _topicService.GetAdvised();
            var newestProducts = _productService.GetNewest();
            var hottestProducts = _productService.GetHottest();

            var viewModel = new FeaturedViewModel
            {
                Topics = topicContracts == null ? null : topicContracts.ConvertAll(refer => refer.ToViewModel()),
                Newest = new ProductGroupViewModel { Title = "New & Noteworthy", Products = newestProducts == null ? null : newestProducts.ConvertAll(refer => refer.ToViewModel()) },
                Hottest = new ProductGroupViewModel { Title = "What's Hot", Products = hottestProducts == null ? null : hottestProducts.ConvertAll(refer => refer.ToViewModel()) }
            };

            return Json(viewModel, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Genius(string version)
        {
            return Json(new { }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Newest(string version)
        {
            return Json(new { }, JsonRequestBehavior.AllowGet);
        }
    }
}
