using System;
using Interation.Repeater.Core.Enums;

namespace Interation.Repeater.Service.Contract
{
    public class ProductContract
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string IconUrl { get; set; }
        public string Class { get; set; }
        public string SubClass { get; set; }
        public bool Visual { get; set; }
        public float Price { get; set; }
        public float Star { get; set; }
        public int ScrollingNumber { get; set; }
        public int Downloads { get; set; }
        public Market Market { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
