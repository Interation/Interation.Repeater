using System.Data.Entity.ModelConfiguration;
using Interation.Repeater.Repository.Entity.Models;


namespace Interation.Repeater.Repository.Entity.Maps
{
    public class TopicMemberMap : EntityTypeConfiguration<TopicMember>
    {
        public TopicMemberMap()
        {
            this.ToTable("TopicMember");
            this.HasKey(t => t.Id);
        }
    }
}
