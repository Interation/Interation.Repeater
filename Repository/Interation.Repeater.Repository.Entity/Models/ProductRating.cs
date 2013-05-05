using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Interation.Repeater.Repository.Entity.Models
{
    public class ProductRating
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int Value { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
