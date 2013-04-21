using System.Collections.Generic;

namespace Interation.Repeater.Api.ViewModel
{
    public class FeaturedViewModel
    {
        public List<TopicViewModel> Topics { get; set; }
        public ProductGroupViewModel Newest { get; set; }
        public ProductGroupViewModel Hottest { get; set; }
    }
}
