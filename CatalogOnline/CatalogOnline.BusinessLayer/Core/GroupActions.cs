using CatalogOnline.DataAccess.Context;
using CatalogOnline.Domain.Entities.Group;
using CatalogOnline.Domain.Models.Group;
using CatalogOnline.Domain.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace CatalogOnline.BusinessLayer.Core
{
     public class GroupActions
     {
          public GroupActionResponse CreateGroupActionExecution(CreateGroupDto createData)
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
                         Semester = createData.Semester
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

          public GroupActionResponse DeleteGroupActionExecution(int groupId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var group = appDbContext.Group.Find(groupId);
                    if (group == null)
                         return new GroupActionResponse { IsValid = false, Message = "Group not found." };

                    appDbContext.Group.Remove(group);
                    appDbContext.SaveChanges();
                    return new GroupActionResponse { IsValid = true, Message = "Group deleted successfully." };
               }
          }

          public GroupActionResponse UpdateGroupActionExecution(int groupId, UpdateGroupDto updateData)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var group = appDbContext.Group.Find(groupId);
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

          public GroupActionResponse GetGroupByIdActionExecution(int groupId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var group = appDbContext.Group.Find(groupId);
                    return new GroupActionResponse
                    {
                         IsValid = group != null,
                         Message = group != null ? "Group retrieved successfully." : "Group not found.",
                         Group = group
                    };
               }
          }

          public GroupActionResponse GetAllGroupsActionExecution()
          {
               using (var appDbContext = new AppDbContext())
               {
                    var groups = appDbContext.Group.Include(g => g.Students).ToList();
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