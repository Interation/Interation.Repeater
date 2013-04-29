using System.Collections.Generic;
using Interation.Repeater.Service.Contract;

namespace Interation.Repeater.Service.IServiceProvider
{
    public interface ITopicService
    {
        TopicContract Get(int id);
        List<TopicContract> GetAdvised();
        List<ProductContract> GetTopicMembers(int topicId);
    }
}
