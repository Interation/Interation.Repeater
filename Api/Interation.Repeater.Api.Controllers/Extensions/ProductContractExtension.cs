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
                Language = contract.Language.ToString(),
                Visual = contract.Visual,
                Version = contract.Version,
                Downloads = contract.Downloads,
                Star = contract.Star,
                Size = contract.Size,
                IconUrl = contract.IconUrl,
                ScrollingNumber = contract.ScrollingNumber,
                Descriptions = contract.Descriptions,
                Created = contract.CreatedDate,
                Updated = contract.UpdatedDate ?? contract.CreatedDate
            };
        }
    }
}
