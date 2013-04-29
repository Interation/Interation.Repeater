using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Interation.Repeater.Repository.Entity.Models
{
    public class TopicMember
    {
        public int Id { get; set; }
        public int TopicId { get; set; }
        public int ProductId { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
