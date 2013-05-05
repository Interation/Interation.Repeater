using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Interation.Repeater.Core.Entities
{
    public class Size
    {
        public int X { get; set; }
        public int Y { get; set; }

        private Size()
        {
 
        }

        public Size(int x, int y)
        {
            X = x;
            Y = y;
        }
    }
}
