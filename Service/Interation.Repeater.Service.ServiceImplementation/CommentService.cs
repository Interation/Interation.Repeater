using System.Collections.Generic;
using Interation.Repeater.Repository.Entity.Models;
using Interation.Repeater.Repository.IRepositoryProvider;
using Interation.Repeater.Service.Contract;
using Interation.Repeater.Service.IServiceProvider;

namespace Interation.Repeater.Service.ServiceImplementation
{
    public class CommentService : ICommentService
    {
        ICommentRepository _commentRepository;

        public CommentService(ICommentRepository commentRepository)
        {
            _commentRepository = commentRepository;
        }

        public List<CommentContract> GetList(string sourceTable, int sourceId)
        {
            var comments = _commentRepository.GetList(sourceTable, sourceId);
            if (comments == null) { return null; }
            return comments.ConvertAll(refer => refer.ToContract());
        }
    }
}
