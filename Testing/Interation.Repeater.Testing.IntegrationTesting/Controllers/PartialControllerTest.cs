using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Interation.Repeater.Api.Controllers;
using Interation.Repeater.IOC;
using Interation.Repeater.Service.IServiceProvider;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Interation.Repeater.Testing.IntegrationTesting.Controllers
{
    [TestClass]
    public class PartialControllerTest
    {
        PartialController _partialController;

        [TestInitialize]
        public void setup()
        {
            _partialController = InjectionRepository.Get<PartialController>();
        }

        [TestMethod]
        public void test_get_product()
        {
            var result = _partialController.Product(24);
        }
    }
}
