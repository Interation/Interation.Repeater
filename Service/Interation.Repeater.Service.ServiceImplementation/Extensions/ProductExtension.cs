using Interation.Repeater.Service.Contract;

namespace Interation.Repeater.Repository.Entity.Models
{
    public static class ProductExtension
    {
        public static ProductContract ToContract(this Product entity)
        {
            return new ProductContract
            {
                Id = entity.Id,
                Name = entity.Name,
                Price = (float)entity.Price,
                Visual = entity.Visual,
                Class = entity.Class,
                SubClass = entity.SubClass,
                Downloads = entity.Downloads ?? 0,
                ScrollingNumber = entity.ScrollingNumber ?? 0,
                Star = (float)entity.Star,
                IconUrl = entity.IconUrl,
                CreatedDate = entity.CreatedDate,
                UpdatedDate = entity.UpdatedDate

            };
        }
    }
}
