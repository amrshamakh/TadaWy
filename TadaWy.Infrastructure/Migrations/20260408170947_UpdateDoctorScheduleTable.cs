using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TadaWy.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDoctorScheduleTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "DoctorSchedules");

            migrationBuilder.DropColumn(
                name: "StartTime",
                table: "DoctorSchedules");

            migrationBuilder.AddColumn<bool>(
                name: "IsWorkingDay",
                table: "DoctorSchedules",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "AppointmentDurationMinutes",
                table: "Doctors",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "DoctorTimeSlots",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DoctorScheduleId = table.Column<int>(type: "int", nullable: false),
                    StartTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "time", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorTimeSlots", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DoctorTimeSlots_DoctorSchedules_DoctorScheduleId",
                        column: x => x.DoctorScheduleId,
                        principalTable: "DoctorSchedules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DoctorTimeSlots_DoctorScheduleId",
                table: "DoctorTimeSlots",
                column: "DoctorScheduleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DoctorTimeSlots");

            migrationBuilder.DropColumn(
                name: "IsWorkingDay",
                table: "DoctorSchedules");

            migrationBuilder.DropColumn(
                name: "AppointmentDurationMinutes",
                table: "Doctors");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "EndTime",
                table: "DoctorSchedules",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddColumn<TimeSpan>(
                name: "StartTime",
                table: "DoctorSchedules",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));
        }
    }
}
