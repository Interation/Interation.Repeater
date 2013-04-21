using System.Data.Entity.ModelConfiguration;
using Interation.Repeater.Repository.Entity.Models;

namespace Interation.Repeater.Repository.Entity.Maps
{
    public class TopicMap : EntityTypeConfiguration<Topic>
    {
        public TopicMap()
        {
            this.ToTable("Topic");
            this.HasKey(t => t.Id);
            this.Property(t => t.Name).HasMaxLength(50);
            this.Property(t => t.ImageUrl).HasMaxLength(500);
        }
    }
}
