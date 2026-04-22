using CatalogOnline.Domain.Entities.Absence;
using CatalogOnline.Domain.Entities.Subject;
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

               // Student → Grades (one-to-many)
               modelBuilder.Entity<StudentData>()
                   .HasMany(s => s.Grades)
                   .WithOne(g => g.Student)
                   .HasForeignKey(g => g.StudentId)
                   .OnDelete(DeleteBehavior.Cascade);

               // Group → Subjects (one-to-many)
               modelBuilder.Entity<GroupData>()
                   .HasMany(g => g.Subjects)
                   .WithOne(s => s.Group)
                   .HasForeignKey(s => s.GroupId)
                   .OnDelete(DeleteBehavior.Cascade);

               // Student → Absences (one-to-many)
               modelBuilder.Entity<StudentData>()
                   .HasMany(s => s.Absences)
                   .WithOne(a => a.Student)
                   .HasForeignKey(a => a.StudentId)
                   .OnDelete(DeleteBehavior.Cascade);

          }

          public DbSet<UserData> User { get; set; }
          public DbSet<GradeData> Grade { get; set; }
          public DbSet<GroupData> Group { get; set; }
          public DbSet<StudentData> Student { get; set; }
          public DbSet<AbsenceData> Absence { get; set; }
          public DbSet<SubjectData> Subject { get; set; }
     }
}