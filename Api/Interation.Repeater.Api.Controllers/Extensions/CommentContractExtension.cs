using Interation.Repeater.Service.Contract;

namespace Interation.Repeater.Api.ViewModel
{
    public static class CommentContractExtension
    {
        public static CommentViewModel ToViewModel(this CommentContract contract)
        {
            return new CommentViewModel
            {
                Id = contract.Id,
                Content = contract.Content,
                UserId = contract.UserId,
                UserNickName = contract.UserNickName,
                CreatedDate = contract.CreatedDate
            };
        }
    }
}
