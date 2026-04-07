using CatalogOnline.Domain.Entities.Teacher;
using Microsoft.EntityFrameworkCore;

namespace CatalogOnline.DataAccess.Context
{
     public class AppDbContext : DbContext
     {
          protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseSqlServer(DbSession.ConnectionString);


          public DbSet<TeacherData> Teachers { get; set; }
     }
}