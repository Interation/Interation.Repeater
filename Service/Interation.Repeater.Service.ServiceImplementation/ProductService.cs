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
