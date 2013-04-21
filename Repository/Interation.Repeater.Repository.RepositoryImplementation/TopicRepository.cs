using System.Collections.Generic;
using System.Linq;
using Interation.Repeater.Repository.Entity;
using Interation.Repeater.Repository.Entity.Models;
using Interation.Repeater.Repository.IRepositoryProvider;

namespace Interation.Repeater.Repository.RepositoryImplementation
{
    public class TopicRepository : ITopicRepository
    {
        public List<Topic> GetCurrentTopics()
        {
            using (var db = new RepeaterDbContext())
            {
                return db.Proc_SelectCurrentTopics().ToList();
            }
        }
    }
}
