using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Interation.Repeater.Repository.Entity.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string IconUrl { get; set; }
        public string Class { get; set; }
        public string SubClass { get; set; }
        public bool Visual { get; set; }
        public decimal? Price { get; set; }
        public decimal? Star { get; set; }
        public int? Downloads { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int? ScrollingNumber { get; set; }
    }
}
