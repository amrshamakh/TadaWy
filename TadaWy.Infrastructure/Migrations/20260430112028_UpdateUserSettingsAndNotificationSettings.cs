using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TadaWy.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserSettingsAndNotificationSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AppointmentReminders",
                table: "UserSettings");

            migrationBuilder.RenameColumn(
                name: "NewBookingAlerts",
                table: "UserSettings",
                newName: "ApplicationNotifications");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ApplicationNotifications",
                table: "UserSettings",
                newName: "NewBookingAlerts");

            migrationBuilder.AddColumn<bool>(
                name: "AppointmentReminders",
                table: "UserSettings",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
