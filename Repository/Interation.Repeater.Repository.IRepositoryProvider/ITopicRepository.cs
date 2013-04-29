using System.Collections.Generic;
using Interation.Repeater.Repository.Entity.Models;

namespace Interation.Repeater.Repository.IRepositoryProvider
{
    public interface ITopicRepository
    {
        Topic Get(int id);
        List<Topic> GetCurrentTopics();
        List<Product> GetTopicMembers(int topicId);
    }
}
