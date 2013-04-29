using System.Collections.Generic;
using Interation.Repeater.Repository.Entity.Models;
using Interation.Repeater.Repository.IRepositoryProvider;
using Interation.Repeater.Service.Contract;
using Interation.Repeater.Service.IServiceProvider;

namespace Interation.Repeater.Service.ServiceImplementation
{
    public class TopicService : ITopicService
    {
        ITopicRepository _topicRepository;

        public TopicService(ITopicRepository topicRepository)
        {
            _topicRepository = topicRepository;
        }

        public TopicContract Get(int id)
        {
            var topic = _topicRepository.Get(id);
            if (topic == null) { return null; }
            return topic.ToContract();
        }

        public List<TopicContract> GetAdvised()
        {
            var topics = _topicRepository.GetCurrentTopics();

            if (topics == null) { return null; }

            return topics.ConvertAll(refer => refer.ToContract());
        }

        public List<ProductContract> GetTopicMembers(int topicId)
        {
            var products = _topicRepository.GetTopicMembers(topicId);

            if (products == null) { return null; }

            return products.ConvertAll(refer => refer.ToContract());
        }
    }
}
