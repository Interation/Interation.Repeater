using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Objects;
using Interation.Repeater.Repository.Entity.Maps;
using Interation.Repeater.Repository.Entity.Models;

namespace Interation.Repeater.Repository.Entity
{
    public partial class RepeaterDbContext : DbContext
    {
        public RepeaterDbContext()
        {
            ((IObjectContextAdapter)this).ObjectContext.CommandTimeout = 120;
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Topic> Topics { get; set; }
        public DbSet<TopicGroup> TopicGroups { get; set; }
        public DbSet<TopicGroupMember> TopicGroupMembers { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new ProductMap());
            modelBuilder.Configurations.Add(new TopicGroupMap());
            modelBuilder.Configurations.Add(new TopicGroupMemberMap());
            modelBuilder.Configurations.Add(new TopicMap());
        }

        public virtual ObjectResult<Topic> Proc_SelectCurrentTopics()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteStoreQuery<Topic>("Proc_SelectCurrentTopics");
        }

        public virtual ObjectResult<Topic> Proc_SelectCurrentTopics(MergeOption mergeOption)
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteStoreQuery<Topic>("Proc_SelectCurrentTopics", mergeOption);
        }

        public virtual ObjectResult<Product> Proc_SelectHottestProducts()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteStoreQuery<Product>("Proc_SelectHottestProducts");
        }

        public virtual ObjectResult<Product> Proc_SelectHottestProducts(MergeOption mergeOption)
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteStoreQuery<Product>("Proc_SelectHottestProducts", mergeOption);
        }

        public virtual ObjectResult<Product> Proc_SelectNewestProducts()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteStoreQuery<Product>("Proc_SelectNewestProducts");
        }

        public virtual ObjectResult<Product> Proc_SelectNewestProducts(MergeOption mergeOption)
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteStoreQuery<Product>("Proc_SelectNewestProducts", mergeOption);
        }
    }
}
