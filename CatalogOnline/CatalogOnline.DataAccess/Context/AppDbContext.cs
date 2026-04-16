using CatalogOnline.Domain.Entities.User;
using Microsoft.EntityFrameworkCore;
using CatalogOnline.Domain.Entities.Grade;

namespace CatalogOnline.DataAccess.Context
{
     public class AppDbContext : DbContext
     {
          protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseSqlServer(DbSession.ConnectionString);


          public DbSet<UserData> User { get; set; }
          public DbSet<GradeData> Grade { get; set; }
     }
}