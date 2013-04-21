using System.Data.Entity.ModelConfiguration;
using Interation.Repeater.Repository.Entity.Models;

namespace Interation.Repeater.Repository.Entity.Maps
{
    public class TopicGroupMap : EntityTypeConfiguration<TopicGroup>
    {
        public TopicGroupMap()
        {
            this.ToTable("TopicGroup");
            this.HasKey(t => t.Id);
            this.Property(t => t.Name).HasMaxLength(50);
        }
    }
}
