using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Migrations
{
    public partial class publikacijeSlika : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PhotoId",
                table: "Publikacije",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Publikacije_PhotoId",
                table: "Publikacije",
                column: "PhotoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Publikacije_Photos_PhotoId",
                table: "Publikacije",
                column: "PhotoId",
                principalTable: "Photos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Publikacije_Photos_PhotoId",
                table: "Publikacije");

            migrationBuilder.DropIndex(
                name: "IX_Publikacije_PhotoId",
                table: "Publikacije");

            migrationBuilder.DropColumn(
                name: "PhotoId",
                table: "Publikacije");
        }
    }
}
