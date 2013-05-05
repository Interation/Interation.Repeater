using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Interation.Repeater.Service.Contract;

namespace Interation.Repeater.Service.IServiceProvider
{
    public interface ICommentService
    {
        List<CommentContract> GetList(string sourceTable, int sourceId);
    }
}
