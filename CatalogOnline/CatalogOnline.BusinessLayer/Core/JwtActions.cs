using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CatalogOnline.Domain.Models.Responses;

public class JwtActions
{
     private readonly IConfiguration _configuration =
          new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();

     public JwtActionResponse GenerateTokenActionExecution(int id, string username, string role)
     {
          var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!);
          var issuer = _configuration["Jwt:Issuer"];
          var audience = _configuration["Jwt:Audience"];
          var expires = DateTime.UtcNow.AddMinutes(double.Parse(_configuration["Jwt:ExpiryMinutes"] ?? "60"));

          var claims = new[]
          {
               new Claim(JwtRegisteredClaimNames.Sub, id.ToString()),
               new Claim(JwtRegisteredClaimNames.Name, username),
               new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
               new Claim(ClaimTypes.Role, role),
          };

          var token = new JwtSecurityToken(
               issuer: issuer,
               audience: audience,
               claims: claims,
               expires: expires,
               signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256));

          return new JwtActionResponse
          {
               IsValid = true,
               Message = "Token generated successfully.",
               Token = new JwtSecurityTokenHandler().WriteToken(token)
          };
     }
}
