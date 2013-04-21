using System.Collections.Generic;
using System.Linq;
using Interation.Repeater.Repository.Entity;
using Interation.Repeater.Repository.Entity.Models;
using Interation.Repeater.Repository.IRepositoryProvider;

namespace Interation.Repeater.Repository.RepositoryImplementation
{
    public class ProductRepository : IProductRepository
    {
        public List<Product> GetNewest()
        {
            using (var db = new RepeaterDbContext())
            {
                return db.Proc_SelectNewestProducts().ToList();
            }
        }

        public List<Product> GetHottest()
        {
            using (var db = new RepeaterDbContext())
            {
                return db.Proc_SelectHottestProducts().ToList();
            }
        }
    }
}
