using System.Collections.Generic;
using Interation.Repeater.Repository.Entity.Models;
using Interation.Repeater.Repository.IRepositoryProvider;
using Interation.Repeater.Service.Contract;
using Interation.Repeater.Service.IServiceProvider;

namespace Interation.Repeater.Service.ServiceImplementation
{
    public class ProductService : IProductService
    {
        IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public ProductContract Get(int id)
        {
            var product = _productRepository.Get(id);
            if (product == null) { return null; }

            var productContract =product.ToContract();
            var productPosters = _productRepository.GetProductPosters(id);
            var productRatings = _productRepository.GetProductRatings(id);

            if (productPosters != null)
            {
                productContract.Posters = productPosters.ConvertAll(refer => refer.ToContract());
            }

            if (productRatings != null)
            {
                productContract.Ratings = productRatings.ConvertAll(refer => refer.ToContract());
            }

            return productContract;
        }

        public List<ProductContract> GetNewest()
        {
            return GetNewest(0);
        }

        public List<ProductContract> GetNewest(int count)
        {
            var products = _productRepository.GetNewest(count);
            if (products == null) { return null; }
            return products.ConvertAll(refer => refer.ToContract());
        }

        public List<ProductContract> GetHottest()
        {
            return GetHottest(0);
        }

        public List<ProductContract> GetHottest(int count)
        {
            var products = _productRepository.GetHottest(count);
            if (products == null) { return null; }
            return products.ConvertAll(refer => refer.ToContract());
        }
    }
}
