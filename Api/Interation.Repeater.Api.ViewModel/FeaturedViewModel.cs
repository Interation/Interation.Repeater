using System.Collections.Generic;

namespace Interation.Repeater.Api.ViewModel
{
    public class FeaturedViewModel
    {
        public List<TopicViewModel> Topics { get; set; }
        public List<ProductViewModel> Newest { get; set; }
        public List<ProductViewModel> Hottest { get; set; }
    }
}
