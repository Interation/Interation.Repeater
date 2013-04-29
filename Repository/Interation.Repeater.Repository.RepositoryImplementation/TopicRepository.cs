using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using Interation.Repeater.Repository.Entity;
using Interation.Repeater.Repository.Entity.Models;
using Interation.Repeater.Repository.IRepositoryProvider;

namespace Interation.Repeater.Repository.RepositoryImplementation
{
    public class TopicRepository : ITopicRepository
    {
        public Topic Get(int id)
        {
            using (var db = new RepeaterDbContext())
            {
                return db.Topics.Where(refer => refer.Id == id).SingleOrDefault();
            }
        }

        public List<Topic> GetCurrentTopics()
        {
            using (var db = new RepeaterDbContext())
            {
                return db.Database.SqlQuery<Topic>("Proc_SelectCurrentTopics").ToList();
            }
        }

        public List<Product> GetTopicMembers(int topicId)
        {
            using (var db = new RepeaterDbContext())
            {
                return db.Database.SqlQuery<Product>("Proc_SelectTopicMembers @topicId", new SqlParameter("topicId", topicId)).ToList();
            }
        }
    }
}
