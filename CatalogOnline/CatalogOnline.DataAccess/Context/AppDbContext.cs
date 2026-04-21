using CatalogOnline.Domain.Entities.Grade;
using CatalogOnline.Domain.Entities.Group;
using CatalogOnline.Domain.Entities.Students;
using CatalogOnline.Domain.Entities.User;
using CatalogOnline.Domain.Entities.Calendar;
using Microsoft.EntityFrameworkCore;

namespace CatalogOnline.DataAccess.Context
{
    public class AppDbContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseSqlite("Data Source=catalog.db");

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<GroupData>()
                .HasMany(g => g.Students)
                .WithOne(st => st.Group)
                .HasForeignKey(st => st.GroupId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        public DbSet<UserData> User { get; set; }
        public DbSet<CalendarEventData> CalendarEvents { get; set; }
        public DbSet<GradeData> Grade { get; set; }
        public DbSet<GroupData> Group { get; set; }
        public DbSet<StudentData> Student { get; set; }
    }
}