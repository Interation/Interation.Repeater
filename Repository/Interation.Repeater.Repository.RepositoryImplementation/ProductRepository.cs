using System.Collections.Generic;
using System.Linq;
using Interation.Repeater.Repository.Entity;
using Interation.Repeater.Repository.Entity.Models;
using Interation.Repeater.Repository.IRepositoryProvider;

namespace Interation.Repeater.Repository.RepositoryImplementation
{
    public class ProductRepository : IProductRepository
    {
        public List<Product> GetNewest(int count)
        {
            using (var db = new RepeaterDbContext())
            {
                var result = db.Proc_SelectNewestProducts();
                if (count == 0) { return result.ToList(); }
                return result.Take(count).ToList();
            }
        }

        public List<Product> GetHottest(int count)
        {
            using (var db = new RepeaterDbContext())
            {
                var result = db.Proc_SelectHottestProducts();
                if (count == 0) { return result.ToList(); }
                return result.Take(count).ToList();
            }
        }
    }
}
