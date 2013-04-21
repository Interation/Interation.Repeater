using System.Collections.Generic;
using Interation.Repeater.Repository.Entity.Models;

namespace Interation.Repeater.Repository.IRepositoryProvider
{
    public interface IProductRepository
    {
        List<Product> GetNewest();
        List<Product> GetHottest();
    }
}
