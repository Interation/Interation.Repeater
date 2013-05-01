using System.Data.Entity.ModelConfiguration;
using Interation.Repeater.Repository.Entity.Models;

namespace Interation.Repeater.Repository.Entity.Maps
{
    public class ProductMap : EntityTypeConfiguration<Product>
    {
        public ProductMap()
        {
            this.ToTable("Product");
            this.HasKey(t => t.Id);
            this.Property(t => t.Class).HasColumnType("varchar").HasMaxLength(20);
            this.Property(t => t.Descriptions).HasColumnType("varchar(max)");
            this.Property(t => t.IconUrl).HasColumnType("varchar").HasMaxLength(500);
            this.Property(t => t.Name).HasMaxLength(50);
            this.Property(t => t.Price).HasPrecision(6, 2);
            this.Property(t => t.Size).HasPrecision(38, 4);
            this.Property(t => t.Star).HasPrecision(2, 1);
            this.Property(t => t.SubClass).HasColumnType("varchar").HasMaxLength(20);
            this.Property(t => t.Version).HasPrecision(6, 1);
        }
    }
}
