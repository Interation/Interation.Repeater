using Interation.Repeater.Service.Contract;

namespace Interation.Repeater.Repository.Entity.Models
{
    public static class TopicExtension
    {
        public static TopicContract ToContract(this Topic entity)
        {
            return new TopicContract
            {
                Id = entity.Id,
                Name = entity.Name,
                ImageUrl = entity.ImageUrl,
                CreatedDate = entity.CreatedDate
            };
        }
    }
}
