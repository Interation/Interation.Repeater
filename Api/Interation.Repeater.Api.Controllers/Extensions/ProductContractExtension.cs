using Interation.Repeater.Api.ViewModel;
using Interation.Repeater.Core.Enums;

namespace Interation.Repeater.Service.Contract
{
    public static class ProductContractExtension
    {
        public static ProductViewModel ToViewModel(this ProductContract contract)
        {
            return new ProductViewModel
            {
                Id = contract.Id,
                Name = contract.Name,
                Price = contract.Price,
                PriceUnit = contract.Market.ToCurrencyUnit().ToUnitString(),
                Class = contract.Class,
                SubClass = contract.SubClass,
                Visual = contract.Visual,
                Downloads = contract.Downloads,
                Star = contract.Star,
                IconUrl = contract.IconUrl,
                ScrollingNumber = contract.ScrollingNumber,
                CreatedDate = contract.CreatedDate,
                UpdatedDate = contract.UpdatedDate
            };
        }
    }
}
