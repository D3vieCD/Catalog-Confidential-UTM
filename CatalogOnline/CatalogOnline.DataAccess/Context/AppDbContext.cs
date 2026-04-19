using CatalogOnline.Domain.Entities.Grade;
using CatalogOnline.Domain.Entities.Group;
using CatalogOnline.Domain.Entities.Students;
using CatalogOnline.Domain.Entities.User;
using Microsoft.EntityFrameworkCore;

namespace CatalogOnline.DataAccess.Context
{
     public class AppDbContext : DbContext
     {
          protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseSqlServer(DbSession.ConnectionString);


          public DbSet<UserData> User { get; set; }
          public DbSet<GradeData> Grade { get; set; }
          public DbSet<GroupData> Group { get; set; }
          public DbSet<StudentData> Student { get; set; }
     }
}