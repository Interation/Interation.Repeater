using System.Data.Entity.ModelConfiguration;
using Interation.Repeater.Repository.Entity.Models;

namespace Interation.Repeater.Repository.Entity.Maps
{
    public class ProductRatingMap : EntityTypeConfiguration<ProductRating>
    {
        public ProductRatingMap()
        {
            this.ToTable("ProductRating");
            this.HasKey(refer => refer.Id);
        }
    }
}
