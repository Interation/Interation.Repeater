using Interation.Repeater.Api.ViewModel;

namespace Interation.Repeater.Service.Contract
{
    public static class ProductPosterContractExtension
    {
        public static ProductPosterViewModel ToViewModel(this ProductPosterContract contract)
        {
            return new ProductPosterViewModel
            {
                ImageUrl = contract.ImageUrl,
                ImageSize = contract.ImageSize
            };
        }
    }
}
