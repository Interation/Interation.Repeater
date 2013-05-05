using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Interation.Repeater.Api.ViewModel
{
    public class CommentViewModel
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public int UserId { get; set; }
        public string UserNickName { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
