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
                name: "Cells",
                columns: table => new
                {
                    CellID = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Category = table.Column<string>(nullable: true),
                    CellLabel = table.Column<string>(nullable: true),
                    Creation = table.Column<DateTime>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    MeasurementCount = table.Column<int>(nullable: false),
                    Modification = table.Column<DateTime>(nullable: false),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cells", x => x.CellID);
                });

            migrationBuilder.CreateTable(
                name: "MeasurementData",
                columns: table => new
                {
                    MeasurementDataID = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeasurementData", x => x.MeasurementDataID);
                });

            migrationBuilder.CreateTable(
                name: "Stacks",
                columns: table => new
                {
                    StackID = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Category = table.Column<string>(nullable: true),
                    CellCount = table.Column<int>(nullable: false),
                    CircuitType = table.Column<int>(nullable: false),
                    Creation = table.Column<DateTime>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    Modification = table.Column<DateTime>(nullable: false),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stacks", x => x.StackID);
                });

            migrationBuilder.CreateTable(
                name: "StackCell",
                columns: table => new
                {
                    StackID = table.Column<int>(nullable: false),
                    CellID = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StackCell", x => new { x.StackID, x.CellID });
                    table.ForeignKey(
                        name: "FK_StackCell_Cells_CellID",
                        column: x => x.CellID,
                        principalTable: "Cells",
                        principalColumn: "CellID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StackCell_Stacks_StackID",
                        column: x => x.StackID,
                        principalTable: "Stacks",
                        principalColumn: "StackID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Measurements",
                columns: table => new
                {
                    MeasurementID = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    BinaryData = table.Column<byte[]>(nullable: true),
                    Category = table.Column<string>(nullable: true),
                    CellID = table.Column<int>(nullable: false),
                    ContentType = table.Column<string>(nullable: true),
                    Creation = table.Column<DateTime>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    FileExtension = table.Column<string>(nullable: true),
                    FileName = table.Column<string>(nullable: true),
                    FileSize = table.Column<long>(nullable: false),
                    MeasurementDataID = table.Column<int>(nullable: true),
                    MeasurementType = table.Column<int>(nullable: false),
                    Modification = table.Column<DateTime>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    StackID = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Measurements", x => x.MeasurementID);
                    table.ForeignKey(
                        name: "FK_Measurements_Cells_CellID",
                        column: x => x.CellID,
                        principalTable: "Cells",
                        principalColumn: "CellID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Measurements_MeasurementData_MeasurementDataID",
                        column: x => x.MeasurementDataID,
                        principalTable: "MeasurementData",
                        principalColumn: "MeasurementDataID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Measurements_Stacks_StackID",
                        column: x => x.StackID,
                        principalTable: "Stacks",
                        principalColumn: "StackID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StackCell_CellID",
                table: "StackCell",
                column: "CellID");

            migrationBuilder.CreateIndex(
                name: "IX_Measurements_CellID",
                table: "Measurements",
                column: "CellID");

            migrationBuilder.CreateIndex(
                name: "IX_Measurements_MeasurementDataID",
                table: "Measurements",
                column: "MeasurementDataID");

            migrationBuilder.CreateIndex(
                name: "IX_Measurements_StackID",
                table: "Measurements",
                column: "StackID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StackCell");

            migrationBuilder.DropTable(
                name: "Measurements");

            migrationBuilder.DropTable(
                name: "Cells");

            migrationBuilder.DropTable(
                name: "MeasurementData");

            migrationBuilder.DropTable(
                name: "Stacks");
        }
    }
}
