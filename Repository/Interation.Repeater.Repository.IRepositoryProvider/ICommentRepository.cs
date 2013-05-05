using System.Collections.Generic;
using Interation.Repeater.Repository.Entity.Complex;

namespace Interation.Repeater.Repository.IRepositoryProvider
{
    public interface ICommentRepository
    {
        List<ComplexComment> GetList(string sourceTable, int sourceId);
    }
}
