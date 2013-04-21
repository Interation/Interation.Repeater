using System.Data.Entity.ModelConfiguration;
using Interation.Repeater.Repository.Entity.Models;

namespace Interation.Repeater.Repository.Entity.Maps
{
    public class TopicGroupMemberMap : EntityTypeConfiguration<TopicGroupMember>
    {
        public TopicGroupMemberMap()
        {
            this.ToTable("TopicGroupMember");
            this.HasKey(t => t.Id);
        }
    }
}
