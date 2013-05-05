using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Interation.Repeater.Service.Contract
{
    public class ProductRatingContract
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int Value { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
