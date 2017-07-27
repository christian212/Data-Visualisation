using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using AspCoreServer.Data;
using AspCoreServer.Models;

namespace App.Migrations
{
    [DbContext(typeof(SpaDbContext))]
    [Migration("20170726185039_Initial")]
    partial class Initial
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.2");

            modelBuilder.Entity("AspCoreServer.Models.Battery", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("CircuitType");

                    b.Property<DateTime>("Created");

                    b.Property<string>("Description");

                    b.Property<DateTime>("Modified");

                    b.Property<string>("Name");

                    b.Property<int>("StackCount");

                    b.HasKey("Id");

                    b.ToTable("Batteries");
                });

            modelBuilder.Entity("AspCoreServer.Models.BatteryStack", b =>
                {
                    b.Property<int>("BatteryId");

                    b.Property<int>("StackId");

                    b.HasKey("BatteryId", "StackId");

                    b.HasIndex("StackId");

                    b.ToTable("BatteryStack");
                });

            modelBuilder.Entity("AspCoreServer.Models.Cell", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("CellLabel");

                    b.Property<DateTime>("Created");

                    b.Property<string>("Description");

                    b.Property<int>("MeasurementCount");

                    b.Property<DateTime>("Modified");

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.ToTable("Cells");
                });

            modelBuilder.Entity("AspCoreServer.Models.Measurement", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("BatteryId");

                    b.Property<int?>("CellId");

                    b.Property<DateTime>("Created");

                    b.Property<string>("Description");

                    b.Property<string>("FileName");

                    b.Property<string>("FilePath");

                    b.Property<long>("FileSize");

                    b.Property<int>("MeasurementType");

                    b.Property<DateTime>("Modified");

                    b.Property<string>("Name");

                    b.Property<int?>("StackId");

                    b.HasKey("Id");

                    b.HasIndex("BatteryId");

                    b.HasIndex("CellId");

                    b.HasIndex("StackId");

                    b.ToTable("Measurements");
                });

            modelBuilder.Entity("AspCoreServer.Models.Stack", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("CellCount");

                    b.Property<int>("CircuitType");

                    b.Property<DateTime>("Created");

                    b.Property<string>("Description");

                    b.Property<DateTime>("Modified");

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.ToTable("Stacks");
                });

            modelBuilder.Entity("AspCoreServer.Models.StackCell", b =>
                {
                    b.Property<int>("StackId");

                    b.Property<int>("CellId");

                    b.HasKey("StackId", "CellId");

                    b.HasIndex("CellId");

                    b.ToTable("StackCell");
                });

            modelBuilder.Entity("AspCoreServer.Models.BatteryStack", b =>
                {
                    b.HasOne("AspCoreServer.Models.Battery", "Battery")
                        .WithMany("BatteryStacks")
                        .HasForeignKey("BatteryId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("AspCoreServer.Models.Stack", "Stack")
                        .WithMany("BatteryStacks")
                        .HasForeignKey("StackId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("AspCoreServer.Models.Measurement", b =>
                {
                    b.HasOne("AspCoreServer.Models.Battery", "Battery")
                        .WithMany("Measurements")
                        .HasForeignKey("BatteryId");

                    b.HasOne("AspCoreServer.Models.Cell", "Cell")
                        .WithMany("Measurements")
                        .HasForeignKey("CellId");

                    b.HasOne("AspCoreServer.Models.Stack", "Stack")
                        .WithMany("Measurements")
                        .HasForeignKey("StackId");
                });

            modelBuilder.Entity("AspCoreServer.Models.StackCell", b =>
                {
                    b.HasOne("AspCoreServer.Models.Cell", "Cell")
                        .WithMany("StackCells")
                        .HasForeignKey("CellId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("AspCoreServer.Models.Stack", "Stack")
                        .WithMany("StackCells")
                        .HasForeignKey("StackId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
        }
    }
}
