using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Interation.Repeater.Repository.Entity.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string SourceTable { get; set; }
        public int SourceId { get; set; }
        public string Content { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
