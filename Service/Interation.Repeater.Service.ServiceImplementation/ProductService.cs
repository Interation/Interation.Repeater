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
            var products = _productRepository.GetNewest();
            if (products == null) { return null; }
            return products.ConvertAll(refer => refer.ToContract());
        }

        public List<ProductContract> GetHottest()
        {
            var products = _productRepository.GetHottest();
            if (products == null) { return null; }
            return products.ConvertAll(refer => refer.ToContract());
        }
    }
}
