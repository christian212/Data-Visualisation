using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DataVisualisation.Migrations
{
    public partial class Records : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FileExtension",
                table: "Records",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FileName",
                table: "Records",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "FileSize",
                table: "Records",
                nullable: false,
                defaultValue: 0L);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FileExtension",
                table: "Records");

            migrationBuilder.DropColumn(
                name: "FileName",
                table: "Records");

            migrationBuilder.DropColumn(
                name: "FileSize",
                table: "Records");
        }
    }
}
