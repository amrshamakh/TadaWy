using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TadaWy.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class LocalizationSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Rename existing columns to 'En' counterparts to preserve data
            migrationBuilder.RenameColumn(name: "Name", table: "Specializations", newName: "NameEn");
            migrationBuilder.RenameIndex(name: "IX_Specializations_Name", table: "Specializations", newName: "IX_Specializations_NameEn");

            migrationBuilder.RenameColumn(name: "Name", table: "ChronicDiseases", newName: "NameEn");
            migrationBuilder.RenameIndex(name: "IX_ChronicDiseases_Name", table: "ChronicDiseases", newName: "IX_ChronicDiseases_NameEn");

            migrationBuilder.RenameColumn(name: "Name", table: "Allergies", newName: "NameEn");
            migrationBuilder.RenameIndex(name: "IX_Allergies_Name", table: "Allergies", newName: "IX_Allergies_NameEn");

            migrationBuilder.RenameColumn(name: "Title", table: "Notifications", newName: "TitleEn");
            migrationBuilder.RenameColumn(name: "Message", table: "Notifications", newName: "MessageEn");

            migrationBuilder.RenameColumn(name: "FirstName", table: "Doctors", newName: "FirstNameEn");
            migrationBuilder.RenameColumn(name: "LastName", table: "Doctors", newName: "LastNameEn");
            migrationBuilder.RenameColumn(name: "Bio", table: "Doctors", newName: "BioEn");
            migrationBuilder.RenameColumn(name: "AddressDescription", table: "Doctors", newName: "AddressDescriptionEn");

            // 2. Add the 'Ar' columns
            migrationBuilder.AddColumn<string>(name: "NameAr", table: "Specializations", type: "nvarchar(100)", maxLength: 100, nullable: false, defaultValue: "");
            migrationBuilder.AddColumn<string>(name: "NameAr", table: "ChronicDiseases", type: "nvarchar(100)", maxLength: 100, nullable: false, defaultValue: "");
            migrationBuilder.AddColumn<string>(name: "NameAr", table: "Allergies", type: "nvarchar(150)", maxLength: 150, nullable: false, defaultValue: "");
            
            migrationBuilder.AddColumn<string>(name: "TitleAr", table: "Notifications", type: "nvarchar(max)", nullable: false, defaultValue: "");
            migrationBuilder.AddColumn<string>(name: "MessageAr", table: "Notifications", type: "nvarchar(max)", nullable: false, defaultValue: "");

            migrationBuilder.AddColumn<string>(name: "FirstNameAr", table: "Doctors", type: "nvarchar(100)", maxLength: 100, nullable: false, defaultValue: "");
            migrationBuilder.AddColumn<string>(name: "LastNameAr", table: "Doctors", type: "nvarchar(100)", maxLength: 100, nullable: false, defaultValue: "");
            migrationBuilder.AddColumn<string>(name: "BioAr", table: "Doctors", type: "nvarchar(1000)", maxLength: 1000, nullable: true);
            migrationBuilder.AddColumn<string>(name: "AddressDescriptionAr", table: "Doctors", type: "nvarchar(500)", maxLength: 500, nullable: true);

            // 3. IMPORTANT: Populate Arabic columns with English data temporarily 
            // so we can create UNIQUE indices without duplicate key errors
            migrationBuilder.Sql("UPDATE Specializations SET NameAr = NameEn");
            migrationBuilder.Sql("UPDATE ChronicDiseases SET NameAr = NameEn");
            migrationBuilder.Sql("UPDATE Allergies SET NameAr = NameEn");
            migrationBuilder.Sql("UPDATE Notifications SET TitleAr = TitleEn, MessageAr = MessageEn");
            migrationBuilder.Sql("UPDATE Doctors SET FirstNameAr = FirstNameEn, LastNameAr = LastNameEn");

            // 4. Now create the Unique Indices
            migrationBuilder.CreateIndex(
                name: "IX_Specializations_NameAr",
                table: "Specializations",
                column: "NameAr",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ChronicDiseases_NameAr",
                table: "ChronicDiseases",
                column: "NameAr",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Allergies_NameAr",
                table: "Allergies",
                column: "NameAr",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(name: "IX_Specializations_NameAr", table: "Specializations");
            migrationBuilder.DropIndex(name: "IX_ChronicDiseases_NameAr", table: "ChronicDiseases");
            migrationBuilder.DropIndex(name: "IX_Allergies_NameAr", table: "Allergies");

            migrationBuilder.DropColumn(name: "NameAr", table: "Specializations");
            migrationBuilder.DropColumn(name: "NameAr", table: "ChronicDiseases");
            migrationBuilder.DropColumn(name: "NameAr", table: "Allergies");
            migrationBuilder.DropColumn(name: "TitleAr", table: "Notifications");
            migrationBuilder.DropColumn(name: "MessageAr", table: "Notifications");
            migrationBuilder.DropColumn(name: "FirstNameAr", table: "Doctors");
            migrationBuilder.DropColumn(name: "LastNameAr", table: "Doctors");
            migrationBuilder.DropColumn(name: "BioAr", table: "Doctors");
            migrationBuilder.DropColumn(name: "AddressDescriptionAr", table: "Doctors");

            migrationBuilder.RenameColumn(name: "NameEn", table: "Specializations", newName: "Name");
            migrationBuilder.RenameIndex(name: "IX_Specializations_NameEn", table: "Specializations", newName: "IX_Specializations_Name");

            migrationBuilder.RenameColumn(name: "NameEn", table: "ChronicDiseases", newName: "Name");
            migrationBuilder.RenameIndex(name: "IX_ChronicDiseases_NameEn", table: "ChronicDiseases", newName: "IX_ChronicDiseases_Name");

            migrationBuilder.RenameColumn(name: "NameEn", table: "Allergies", newName: "Name");
            migrationBuilder.RenameIndex(name: "IX_Allergies_NameEn", table: "Allergies", newName: "IX_Allergies_Name");

            migrationBuilder.RenameColumn(name: "TitleEn", table: "Notifications", newName: "Title");
            migrationBuilder.RenameColumn(name: "MessageEn", table: "Notifications", newName: "Message");

            migrationBuilder.RenameColumn(name: "FirstNameEn", table: "Doctors", newName: "FirstName");
            migrationBuilder.RenameColumn(name: "LastNameEn", table: "Doctors", newName: "LastName");
            migrationBuilder.RenameColumn(name: "BioEn", table: "Doctors", newName: "Bio");
            migrationBuilder.RenameColumn(name: "AddressDescriptionEn", table: "Doctors", newName: "AddressDescription");
        }
    }
}
