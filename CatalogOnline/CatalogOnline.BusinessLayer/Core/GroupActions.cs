using CatalogOnline.DataAccess.Context;
using CatalogOnline.Domain.Entities.Group;
using CatalogOnline.Domain.Models.Group;
using CatalogOnline.Domain.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace CatalogOnline.BusinessLayer.Core
{
     public class GroupActions
     {
          public GroupActionResponse CreateGroupActionExecution(CreateGroupDto createData, int userId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var group = new GroupData
                    {
                         GroupName = createData.GroupName,
                         Year = createData.Year,
                         Faculty = createData.Faculty,
                         Specialization = createData.Specialization,
                         Coordinator = createData.Coordinator,
                         MaxCapacity = createData.MaxCapacity,
                         Semester = createData.Semester,
                         UserId = userId
                    };
                    appDbContext.Group.Add(group);
                    appDbContext.SaveChanges();
                    return new GroupActionResponse
                    {
                         IsValid = true,
                         Message = "Group created successfully.",
                         Group = group
                    };
               }
          }

          public GroupActionResponse DeleteGroupActionExecution(int groupId, int userId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var group = appDbContext.Group.FirstOrDefault(g => g.Id == groupId && g.UserId == userId);
                    if (group == null)
                         return new GroupActionResponse { IsValid = false, Message = "Group not found." };

                    appDbContext.Group.Remove(group);
                    appDbContext.SaveChanges();
                    return new GroupActionResponse { IsValid = true, Message = "Group deleted successfully." };
               }
          }

          public GroupActionResponse UpdateGroupActionExecution(int groupId, UpdateGroupDto updateData, int userId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var group = appDbContext.Group.FirstOrDefault(g => g.Id == groupId && g.UserId == userId);
                    if (group == null)
                         return new GroupActionResponse { IsValid = false, Message = "Group not found." };

                    group.GroupName = updateData.GroupName;
                    group.Year = updateData.Year;
                    group.Faculty = updateData.Faculty;
                    group.Specialization = updateData.Specialization;
                    group.Coordinator = updateData.Coordinator;
                    group.MaxCapacity = updateData.MaxCapacity;
                    group.Semester = updateData.Semester;
                    appDbContext.SaveChanges();
                    return new GroupActionResponse { IsValid = true, Message = "Group updated successfully." };
               }
          }

          public GroupActionResponse GetGroupByIdActionExecution(int groupId, int userId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var group = appDbContext.Group
                         .Include(g => g.Students)
                         .FirstOrDefault(g => g.Id == groupId && g.UserId == userId);
                    return new GroupActionResponse
                    {
                         IsValid = group != null,
                         Message = group != null ? "Group retrieved successfully." : "Group not found.",
                         Group = group
                    };
               }
          }

          public GroupActionResponse GetAllGroupsActionExecution(int userId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var groups = appDbContext.Group
                         .Include(g => g.Students)
                         .Where(g => g.UserId == userId)
                         .ToList();
                    groups.ForEach(g => g.CurrentCapacity = g.Students.Count);
                    return new GroupActionResponse
                    {
                         IsValid = true,
                         Message = "Groups retrieved successfully.",
                         Groups = groups
                    };
               }
          }
     }
}
