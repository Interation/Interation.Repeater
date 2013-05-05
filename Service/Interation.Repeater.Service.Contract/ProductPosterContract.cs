using System;
using Interation.Repeater.Core.Entities;

namespace Interation.Repeater.Service.Contract
{
    public class ProductPosterContract
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ImageUrl { get; set; }
        public Size ImageSize { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
