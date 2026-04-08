using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TadaWy.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDoctorCareerStartDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CareerStartDate",
                table: "Doctors",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CareerStartDate",
                table: "Doctors");
        }
    }
}
