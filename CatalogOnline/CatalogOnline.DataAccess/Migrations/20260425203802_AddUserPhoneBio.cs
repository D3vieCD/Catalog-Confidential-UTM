using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CatalogOnline.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddUserPhoneBio : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Bio",
                table: "User",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "User",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Bio",
                table: "User");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "User");
        }
    }
}
