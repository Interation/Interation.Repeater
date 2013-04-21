using System;

namespace Interation.Repeater.Repository.Entity.Models
{
    public class Topic
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ImageUrl { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
