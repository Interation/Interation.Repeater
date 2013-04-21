using System.Collections.Generic;
using Interation.Repeater.Service.Contract;

namespace Interation.Repeater.Service.IServiceProvider
{
    public interface IProductService
    {
        List<ProductContract> GetNewest();
        List<ProductContract> GetHottest();
    }
}
