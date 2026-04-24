using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CatalogOnline.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class Evaluation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Evaluation",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SubjectId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Evaluation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Evaluation_Subject_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subject",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.AddColumn<int>(
                name: "EvaluationId",
                table: "Grade",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EvaluationId",
                table: "Absence",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Grade_EvaluationId",
                table: "Grade",
                column: "EvaluationId");

            migrationBuilder.CreateIndex(
                name: "IX_Absence_EvaluationId",
                table: "Absence",
                column: "EvaluationId");

            migrationBuilder.CreateIndex(
                name: "IX_Evaluation_SubjectId",
                table: "Evaluation",
                column: "SubjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_Absence_Evaluation_EvaluationId",
                table: "Absence",
                column: "EvaluationId",
                principalTable: "Evaluation",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Grade_Evaluation_EvaluationId",
                table: "Grade",
                column: "EvaluationId",
                principalTable: "Evaluation",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Absence_Evaluation_EvaluationId",
                table: "Absence");

            migrationBuilder.DropForeignKey(
                name: "FK_Grade_Evaluation_EvaluationId",
                table: "Grade");

            migrationBuilder.DropTable(
                name: "Evaluation");

            migrationBuilder.DropIndex(
                name: "IX_Grade_EvaluationId",
                table: "Grade");

            migrationBuilder.DropIndex(
                name: "IX_Absence_EvaluationId",
                table: "Absence");

            migrationBuilder.DropColumn(
                name: "EvaluationId",
                table: "Grade");

            migrationBuilder.DropColumn(
                name: "EvaluationId",
                table: "Absence");
        }
    }
}
