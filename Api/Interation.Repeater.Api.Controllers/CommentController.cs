using System.Web.Mvc;
using Interation.Repeater.Service.IServiceProvider;
using Interation.Repeater.Api.ViewModel;

namespace Interation.Repeater.Api.Controllers
{
    public class CommentController: Controller
    {
        ICommentService _commentService;

        public CommentController(ICommentService commentService)
        {
            _commentService = commentService;
        }

        public JsonResult Index(string sourceTable, int sourceId)
        {
            var commentContracts = _commentService.GetList(sourceTable, sourceId);
            if (commentContracts == null) { return Json(new { success = false, message = "Comment not found" }); }
            var commentViewModel = commentContracts.ConvertAll(refer => refer.ToViewModel());

            return Json(commentViewModel, JsonRequestBehavior.AllowGet);
        }
    }
}
