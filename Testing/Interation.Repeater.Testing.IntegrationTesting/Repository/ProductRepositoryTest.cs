using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Interation.Repeater.IOC;
using Interation.Repeater.Repository.IRepositoryProvider;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Interation.Repeater.Testing.IntegrationTesting.Repository
{
    [TestClass]
    public class ProductRepositoryTest
    {
        IProductRepository _productRepository;

        [TestInitialize]
        public void setup()
        {
            _productRepository = InjectionRepository.Get<IProductRepository>();
        }

        [TestMethod]
        public void test_get()
        {
            var product = _productRepository.Get(24);
        }

        [TestMethod]
        public void test_get_product_poster()
        {
            var poster = _productRepository.GetProductPosters(24);
        }
    }
}
