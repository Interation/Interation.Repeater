using Interation.Repeater.Repository.Entity.Complex;
using Interation.Repeater.Service.Contract;

namespace Interation.Repeater.Repository.Entity.Models
{
    public static class ComplexCommentExtension
    {
        public static CommentContract ToContract(this ComplexComment complex)
        {
            return new CommentContract
            {
                Id = complex.Id,
                SourceTable = complex.SourceTable,
                SourceId = complex.SourceId,
                Content = complex.Content,
                UserId = complex.UserId,
                UserNickName = complex.UserNickName,
                CreatedDate = complex.CreatedDate
            };
        }
    }
}
