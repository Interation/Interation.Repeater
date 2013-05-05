using Interation.Repeater.Core.Entities;
using Interation.Repeater.Service.Contract;

namespace Interation.Repeater.Repository.Entity.Models
{
    public static class ProductPosterExtension
    {
        public static ProductPosterContract ToContract(this ProductPoster entity)
        {
            return new ProductPosterContract
            {
                Id = entity.Id,
                ProductId = entity.ProductId,
                ImageUrl = entity.ImageUrl,
                ImageSize = new Size(entity.ImageWidth, entity.ImageHeight),
                CreatedDate = entity.CreatedDate
            };
        }
    }
}
