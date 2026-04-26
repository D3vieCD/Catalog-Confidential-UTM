using CatalogOnline.Domain.Entities.Absence;
using CatalogOnline.Domain.Entities.Evaluation;
using CatalogOnline.Domain.Entities.Subject;
using CatalogOnline.Domain.Entities.Grade;
using CatalogOnline.Domain.Entities.Group;
using CatalogOnline.Domain.Entities.Students;
using CatalogOnline.Domain.Entities.User;
using CatalogOnline.Domain.Entities.Calendar;
using CatalogOnline.Domain.Entities.Notification;
using CatalogOnline.Domain.Entities.Report;
using Microsoft.EntityFrameworkCore;

namespace CatalogOnline.DataAccess.Context
{
     public class AppDbContext : DbContext
     {
          protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseSqlServer(DbSession.ConnectionString);
          protected override void OnModelCreating(ModelBuilder modelBuilder)
          {
               base.OnModelCreating(modelBuilder);

               // Group → Students (one-to-many)
               modelBuilder.Entity<GroupData>()
                   .HasMany(g => g.Students)
                   .WithOne(st => st.Group)
                   .HasForeignKey(st => st.GroupId)
                   .OnDelete(DeleteBehavior.Cascade);

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

               // Subject → Evaluations (one-to-many)
               modelBuilder.Entity<SubjectData>()
                   .HasMany(s => s.Evaluations)
                   .WithOne(e => e.Subject)
                   .HasForeignKey(e => e.SubjectId)
                   .OnDelete(DeleteBehavior.Cascade);

               // Evaluation → Grades (one-to-many, NoAction to avoid multiple cascade paths)
               modelBuilder.Entity<EvaluationData>()
                   .HasMany(e => e.Grades)
                   .WithOne(g => g.Evaluation)
                   .HasForeignKey(g => g.EvaluationId)
                   .OnDelete(DeleteBehavior.NoAction);

               // Evaluation → Absences (one-to-many, NoAction to avoid multiple cascade paths)
               modelBuilder.Entity<EvaluationData>()
                   .HasMany(e => e.Absences)
                   .WithOne(a => a.Evaluation)
                   .HasForeignKey(a => a.EvaluationId)
                   .OnDelete(DeleteBehavior.NoAction);

               // User → Reports (one-to-many)
               modelBuilder.Entity<ReportData>()
                   .HasOne(r => r.User)
                   .WithMany()
                   .HasForeignKey(r => r.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

               // Group → Reports (one-to-many, NoAction to avoid multiple cascade paths)
               modelBuilder.Entity<ReportData>()
                   .HasOne(r => r.Group)
                   .WithMany()
                   .HasForeignKey(r => r.GroupId)
                   .OnDelete(DeleteBehavior.NoAction);

               // Student → Reports (optional, NoAction)
               modelBuilder.Entity<ReportData>()
                   .HasOne(r => r.Student)
                   .WithMany()
                   .HasForeignKey(r => r.StudentId)
                   .OnDelete(DeleteBehavior.NoAction);

               // User → ImportLog (one-to-many, Cascade)
               modelBuilder.Entity<ImportLogData>()
                   .HasOne(i => i.User)
                   .WithMany()
                   .HasForeignKey(i => i.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

               // Group → ImportLog (one-to-many, NoAction to avoid multiple cascade paths)
               modelBuilder.Entity<ImportLogData>()
                   .HasOne(i => i.Group)
                   .WithMany()
                   .HasForeignKey(i => i.GroupId)
                   .OnDelete(DeleteBehavior.NoAction);

          }

          public DbSet<UserData> User { get; set; }
          public DbSet<GradeData> Grade { get; set; }
          public DbSet<GroupData> Group { get; set; }
          public DbSet<StudentData> Student { get; set; }
          public DbSet<AbsenceData> Absence { get; set; }
          public DbSet<SubjectData> Subject { get; set; }
          public DbSet<EvaluationData> Evaluation { get; set; }
          public DbSet<CalendarEventData> CalendarEvents { get; set; }
          public DbSet<ReportData> Report { get; set; }
          public DbSet<ImportLogData> ImportLog { get; set; }
          public DbSet<NotificationSeenData> NotificationSeen { get; set; }
          public DbSet<PasswordResetTokenData> PasswordResetToken { get; set; }
          public DbSet<EmailVerificationData> EmailVerification { get; set; }
     }
}