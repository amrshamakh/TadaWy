using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TadaWy.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addBan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "BannedAt",
                table: "Doctors",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BannedReason",
                table: "Doctors",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BannedAt",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "BannedReason",
                table: "Doctors");
        }
    }
}
