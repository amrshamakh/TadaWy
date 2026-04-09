using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TadaWy.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AIConfigrationChange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AiBrainScans_UserId",
                table: "AiBrainScans");

            migrationBuilder.CreateIndex(
                name: "IX_AiBrainScans_UserId_CreatedAt",
                table: "AiBrainScans",
                columns: new[] { "UserId", "CreatedAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AiBrainScans_UserId_CreatedAt",
                table: "AiBrainScans");

            migrationBuilder.CreateIndex(
                name: "IX_AiBrainScans_UserId",
                table: "AiBrainScans",
                column: "UserId");
        }
    }
}
