using System.Data.Entity.ModelConfiguration;
using Interation.Repeater.Repository.Entity.Models;

namespace Interation.Repeater.Repository.Entity.Maps
{
    public class CommentMap : EntityTypeConfiguration<Comment>
    {
        public CommentMap()
        {
            this.ToTable("Comment");
            this.HasKey(t => t.Id);
            this.Property(t => t.Content).HasColumnType("varchar(max)");
            this.Property(t => t.SourceTable).HasColumnType("varchar").HasMaxLength(100);
        }
    }
}
