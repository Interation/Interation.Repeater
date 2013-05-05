using System.Collections.Generic;
using Interation.Repeater.Api.ViewModel;
using Interation.Repeater.Core.Enums;

namespace Interation.Repeater.Service.Contract
{
    public static class ProductContractExtension
    {
        public static ProductViewModel ToViewModel(this ProductContract contract)
        {
            var viewModel = new ProductViewModel
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

            viewModel.Posters = contract.Posters == null ? null : contract.Posters.ConvertAll(refer => refer.ToViewModel());
            viewModel.Ratings = contract.Ratings == null ? null : contract.Ratings.ConvertAll(refer => refer.ToViewModel());
            viewModel.StatisticalRating = GetStatisticalRating(viewModel.Ratings);
            viewModel.Star = GetAverageRating(viewModel.Ratings);

            return viewModel;
        }

        private static Dictionary<string, int> GetStatisticalRating(List<ProductRatingViewModel> ratings)
        {
            var result = new Dictionary<string, int>
            {
                {"1",0},{"2",0},{"3",0},{"4",0},{"5",0}
            };

            if (ratings == null || ratings.Count == 0) { return result; }

            ratings.ForEach(refer => result[refer.Value.ToString()]++);

            return result;
        }

        private static float GetAverageRating(List<ProductRatingViewModel> ratings)
        {
            if (ratings == null || ratings.Count == 0) { return 0; }

            var sum = 0f;
            ratings.ForEach(refer => { sum += refer.Value; });

            return sum / ratings.Count;
        }
    }
}
