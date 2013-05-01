using System.Collections.Generic;
using System.Linq;
using Interation.Repeater.Repository.Entity;
using Interation.Repeater.Repository.Entity.Models;
using Interation.Repeater.Repository.IRepositoryProvider;

namespace Interation.Repeater.Repository.RepositoryImplementation
{
    public class ProductRepository : IProductRepository
    {
        public Product Get(int id)
        {
            using (var db = new RepeaterDbContext())
            {
                return db.Products.Where(refer => refer.Id == id).SingleOrDefault();
            }
        }

        public List<Product> GetNewest(int count)
        {
            using (var db = new RepeaterDbContext())
            {
                var result = db.Database.SqlQuery<Product>("Proc_SelectNewestProducts").ToList();
                if (count == 0) { return result.ToList(); }
                return result.Take(count).ToList();
            }
        }

        public List<Product> GetHottest(int count)
        {
            using (var db = new RepeaterDbContext())
            {
                var result = db.Database.SqlQuery<Product>("Proc_SelectHottestProducts").ToList();
                if (count == 0) { return result.ToList(); }
                return result.Take(count).ToList();
            }
        }
    }
}
