using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CatalogOnline.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddUserIdToGroup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Group",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Group");
        }
    }
}
