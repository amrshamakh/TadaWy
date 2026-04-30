using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TadaWy.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class wallet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Balance",
                table: "DoctorWallets",
                newName: "TotalBalance");

            migrationBuilder.AddColumn<bool>(
                name: "IsReleasedToWallet",
                table: "Payments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "AvailableBalance",
                table: "DoctorWallets",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsReleasedToWallet",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "AvailableBalance",
                table: "DoctorWallets");

            migrationBuilder.RenameColumn(
                name: "TotalBalance",
                table: "DoctorWallets",
                newName: "Balance");
        }
    }
}
