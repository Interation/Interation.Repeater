using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Interation.Repeater.Core.Enums
{
    public enum CurrencyUnit
    {
        RMB,
        USD,
        HKD,
        YEN
    }

    public static class CurrencyUnitExtension
    {
        public static string ToUnitString(this CurrencyUnit currencyUnit)
        {
            switch (currencyUnit)
            {
                case CurrencyUnit.RMB:
                    return "￥";
                case CurrencyUnit.YEN:
                    return "円";
                case CurrencyUnit.HKD:
                case CurrencyUnit.USD:
                    return "$";
                default:
                    throw new Exception("Unhandled CurrencyUnit");
            }
        }
    }
}
