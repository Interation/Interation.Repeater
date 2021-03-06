﻿using System.Collections.Generic;
using Interation.Repeater.Service.Contract;

namespace Interation.Repeater.Service.IServiceProvider
{
    public interface IProductService
    {
        ProductContract Get(int id);
        List<ProductContract> GetNewest();
        List<ProductContract> GetNewest(int count);
        List<ProductContract> GetHottest();
        List<ProductContract> GetHottest(int count);
    }
}
