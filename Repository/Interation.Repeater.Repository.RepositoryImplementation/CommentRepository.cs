using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using Interation.Repeater.Repository.Entity;
using Interation.Repeater.Repository.Entity.Complex;
using Interation.Repeater.Repository.IRepositoryProvider;

namespace Interation.Repeater.Repository.RepositoryImplementation
{
    public class CommentRepository : ICommentRepository
    {
        public List<ComplexComment> GetList(string sourceTable, int sourceId)
        {
            using (var db = new RepeaterDbContext())
            {
                var sourceTableParameter = new SqlParameter("sourceTable", sourceTable);
                var sourceIdParameter = new SqlParameter("sourceId", sourceId);

                return db.Database.SqlQuery<ComplexComment>("Proc_SelectNormalComments @sourceTable, @sourceId", sourceTableParameter, sourceIdParameter).ToList();
            }
        }
    }
}
