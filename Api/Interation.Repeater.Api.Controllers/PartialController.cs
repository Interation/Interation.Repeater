using System;
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
            var newestProducts = _productService.GetNewest(24);
            var hottestProducts = _productService.GetHottest(24);

            var viewModel = new FeaturedViewModel
            {
                Topics = topicContracts == null ? null : topicContracts.ConvertAll(refer => refer.ToViewModel()),
                Newest = newestProducts == null ? null : newestProducts.ConvertAll(refer => refer.ToViewModel()),
                Hottest = hottestProducts == null ? null : hottestProducts.ConvertAll(refer => refer.ToViewModel())
            };

            return Json(viewModel, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Genius(string version)
        {
            return Json(new { }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Topic(int id)
        {
            var topicContract = _topicService.Get(id);

            if (topicContract == null)
            {
                return Json(new { success = false, message = "Topic not found" });
            }

            var products = _topicService.GetTopicMembers(topicContract.Id);

            var topicViewModel = new TopicViewModel
            {
                Id = topicContract.Id,
                Name = topicContract.Name,
                ImageUrl = topicContract.ImageUrl,
                CreatedDate = topicContract.CreatedDate,
                Products = products == null ? null : products.ConvertAll(refer => refer.ToViewModel())
            };

            return Json(topicViewModel, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Products(string orderby)
        {
            var viewModel = null as List<ProductViewModel>;

            switch (orderby)
            {
                case "hottest":
                    viewModel = _productService.GetHottest().ConvertAll(refer => refer.ToViewModel());
                    break;
                case "newest":
                    viewModel = _productService.GetNewest().ConvertAll(refer => refer.ToViewModel());
                    break;
            }

            return Json(viewModel, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Product(int id)
        {
            var product = _productService.Get(id);

            if (product == null)
            {
                return Json(new { success = false, message = "Topic not found" });
            }

            return Json(product.ToViewModel(), JsonRequestBehavior.AllowGet);
        }
    }
}
