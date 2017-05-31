using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DataVisualisation.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Records",
                columns: table => new
                {
                    RecordId = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    BinaryData = table.Column<byte[]>(nullable: true),
                    Category = table.Column<string>(nullable: true),
                    ContentType = table.Column<string>(nullable: true),
                    Creation = table.Column<DateTime>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    Modification = table.Column<DateTime>(nullable: false),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Records", x => x.RecordId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Records");
        }
    }
}
