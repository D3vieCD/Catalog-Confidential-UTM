namespace CatalogOnline.Domain.Models.Group
{
     public class CreateGroupDto
     {
          public string? GroupName { get; set; }
          public int Year { get; set; }
          public string? Faculty { get; set; }
          public string? Specialization { get; set; }
          public string? Coordinator { get; set; }
          public int MaxCapacity { get; set; }
          public int Semester { get; set; }
     }
}