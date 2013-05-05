using Interation.Repeater.Api.ViewModel;

namespace Interation.Repeater.Service.Contract
{
    public static class ProductRatingContractExtension
    {
        public static ProductRatingViewModel ToViewModel(this ProductRatingContract contract)
        {
            return new ProductRatingViewModel
            {
                UserId = contract.UserId,
                Value = CorrectValue(contract.Value)
            };
        }

        private static int CorrectValue(int value)
        {
            if (value < 1) { value = 1; }
            else if (value > 5) { value = 5; }

            return value;
        }
    }
}
