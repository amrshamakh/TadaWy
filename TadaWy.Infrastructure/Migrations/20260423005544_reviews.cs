using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TadaWy.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class reviews : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_DoctorReviews_PatientId",
                table: "DoctorReviews",
                column: "PatientId");

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorReviews_Patients_PatientId",
                table: "DoctorReviews",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorReviews_Patients_PatientId",
                table: "DoctorReviews");

            migrationBuilder.DropIndex(
                name: "IX_DoctorReviews_PatientId",
                table: "DoctorReviews");
        }
    }
}
