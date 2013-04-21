using System.Collections.Generic;
using Interation.Repeater.Repository.Entity.Models;

namespace Interation.Repeater.Repository.IRepositoryProvider
{
    public interface ITopicRepository
    {
        List<Topic> GetCurrentTopics();
    }
}
