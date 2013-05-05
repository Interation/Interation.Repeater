using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity.ModelConfiguration;
using Interation.Repeater.Repository.Entity.Models;

namespace Interation.Repeater.Repository.Entity.Maps
{
    public class ProductPosterMap : EntityTypeConfiguration<ProductPoster>
    {
        public ProductPosterMap()
        {
            this.ToTable("ProductPoster");
            this.HasKey(refer => refer.Id);
            this.Property(t => t.ImageUrl).HasColumnType("varchar").HasMaxLength(5000);
        }
    }
}
