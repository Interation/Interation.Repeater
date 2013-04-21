using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Interation.Repeater.Core.Enums
{
    public enum Market
    {
        Default = 0,
        Chinese = 1,
        HongKong = 2,
        Japaness = 3
    }

    public static class MarketExtension
    {
        public static CurrencyUnit ToCurrencyUnit(this Market market)
        {
            switch (market)
            {
                case Market.Chinese:
                    return CurrencyUnit.RMB;
                case Market.HongKong:
                    return CurrencyUnit.HKD;
                case Market.Japaness:
                    return CurrencyUnit.YEN;
                default:
                    return CurrencyUnit.USD;
            }
        }
    }
}
