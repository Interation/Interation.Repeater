using System;
using System.Collections.Generic;

namespace Interation.Repeater.Api.ViewModel
{
    public class ProductViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string IconUrl { get; set; }
        public string Class { get; set; }
        public string SubClass { get; set; }
        public string Language { get; set; }
        public bool Visual { get; set; }
        public float Version { get; set; }
        public float Size { get; set; }
        public float Price { get; set; }
        public string PriceUnit { get; set; }
        public float Star { get; set; }
        public int ScrollingNumber { get; set; }
        public int Downloads { get; set; }
        public List<string> Descriptions { get; set; }
        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }
    }
}
