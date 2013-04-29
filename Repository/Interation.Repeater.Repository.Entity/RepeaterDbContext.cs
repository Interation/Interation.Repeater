using System.Data;
using System.Data.Common;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Objects;
using System.Data.SqlClient;
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
        public DbSet<TopicMember> TopicMembers { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new ProductMap());
            modelBuilder.Configurations.Add(new TopicGroupMap());
            modelBuilder.Configurations.Add(new TopicGroupMemberMap());
            modelBuilder.Configurations.Add(new TopicMap());
            modelBuilder.Configurations.Add(new TopicMemberMap());
        }
    }
}
