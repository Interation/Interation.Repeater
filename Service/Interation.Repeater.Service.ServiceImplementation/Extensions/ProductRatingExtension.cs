using Interation.Repeater.Service.Contract;

namespace Interation.Repeater.Repository.Entity.Models
{
    public static class ProductRatingExtension
    {
        public static ProductRatingContract ToContract(this ProductRating entity)
        {
            return new ProductRatingContract
            {
                Id = entity.Id,
                ProductId = entity.Id,
                Value = CorrectValue(entity.Value),
                UserId = entity.UserId,
                CreatedDate = entity.CreatedDate
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
