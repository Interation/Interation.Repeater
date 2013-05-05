using System.Collections.Generic;
using Interation.Repeater.Repository.Entity.Models;

namespace Interation.Repeater.Repository.IRepositoryProvider
{
    public interface IProductRepository
    {
        Product Get(int id);
        List<ProductPoster> GetProductPosters(int productId);
        List<ProductRating> GetProductRatings(int productId);
        List<Product> GetNewest(int count);
        List<Product> GetHottest(int count);
    }
}
