using System.Data.Entity.ModelConfiguration;
using Interation.Repeater.Repository.Entity.Models;

namespace Interation.Repeater.Repository.Entity.Maps
{
    public class UserMap : EntityTypeConfiguration<User>
    {
        public UserMap()
        {
            this.ToTable("User");
            this.HasKey(t => t.Id);
            this.Property(t => t.FirstName).HasColumnType("varchar").HasMaxLength(25);
            this.Property(t => t.LastName).HasColumnType("varchar").HasMaxLength(25);
            this.Property(t => t.Name).HasColumnType("varchar").HasMaxLength(50);
        }
    }
}
