using System.Collections.Generic;
using Interation.Repeater.Core.Enums;
using Interation.Repeater.Foundation.Utility;
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
                Size = (float)entity.Size,
                Visual = entity.Visual,
                Class = entity.Class,
                SubClass = entity.SubClass,
                Version = (float)entity.Version,
                Language = (Language)entity.Language,
                Downloads = entity.Downloads ?? 0,
                ScrollingNumber = entity.ScrollingNumber ?? 0,
                Star = (float)entity.Star,
                IconUrl = entity.IconUrl,
                Descriptions = JsonFormatterUtility.Deserialize<List<string>>(entity.Descriptions),
                CreatedDate = entity.CreatedDate,
                UpdatedDate = entity.UpdatedDate
            };
        }
    }
}
