using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Data_Visualisation.Data;
using Data_Visualisation.Models;

namespace DataVisualisation.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.2");

            modelBuilder.Entity("Data_Visualisation.Data.StackCell", b =>
                {
                    b.Property<int>("StackID");

                    b.Property<int>("CellID");

                    b.HasKey("StackID", "CellID");

                    b.HasIndex("CellID");

                    b.ToTable("StackCell");
                });

            modelBuilder.Entity("Data_Visualisation.Models.Cell", b =>
                {
                    b.Property<int>("CellID")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Category");

                    b.Property<string>("CellLabel");

                    b.Property<DateTime>("Creation");

                    b.Property<string>("Description");

                    b.Property<int>("MeasurementCount");

                    b.Property<DateTime>("Modification");

                    b.Property<string>("Name");

                    b.HasKey("CellID");

                    b.ToTable("Cells");
                });

            modelBuilder.Entity("Data_Visualisation.Models.Measurement", b =>
                {
                    b.Property<int>("MeasurementID")
                        .ValueGeneratedOnAdd();

                    b.Property<byte[]>("BinaryData");

                    b.Property<string>("Category");

                    b.Property<int>("CellID");

                    b.Property<string>("ContentType");

                    b.Property<DateTime>("Creation");

                    b.Property<string>("Description");

                    b.Property<string>("FileExtension");

                    b.Property<string>("FileName");

                    b.Property<long>("FileSize");

                    b.Property<int?>("MeasurementDataID");

                    b.Property<int>("MeasurementType");

                    b.Property<DateTime>("Modification");

                    b.Property<string>("Name");

                    b.Property<int?>("StackID");

                    b.HasKey("MeasurementID");

                    b.HasIndex("CellID");

                    b.HasIndex("MeasurementDataID");

                    b.HasIndex("StackID");

                    b.ToTable("Measurements");
                });

            modelBuilder.Entity("Data_Visualisation.Models.MeasurementData", b =>
                {
                    b.Property<int>("MeasurementDataID")
                        .ValueGeneratedOnAdd();

                    b.HasKey("MeasurementDataID");

                    b.ToTable("MeasurementData");
                });

            modelBuilder.Entity("Data_Visualisation.Models.Stack", b =>
                {
                    b.Property<int>("StackID")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Category");

                    b.Property<int>("CellCount");

                    b.Property<int>("CircuitType");

                    b.Property<DateTime>("Creation");

                    b.Property<string>("Description");

                    b.Property<DateTime>("Modification");

                    b.Property<string>("Name");

                    b.HasKey("StackID");

                    b.ToTable("Stacks");
                });

            modelBuilder.Entity("Data_Visualisation.Data.StackCell", b =>
                {
                    b.HasOne("Data_Visualisation.Models.Cell", "Cell")
                        .WithMany("StackCells")
                        .HasForeignKey("CellID")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Data_Visualisation.Models.Stack", "Stack")
                        .WithMany("StackCells")
                        .HasForeignKey("StackID")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Data_Visualisation.Models.Measurement", b =>
                {
                    b.HasOne("Data_Visualisation.Models.Cell", "Cell")
                        .WithMany("Measurements")
                        .HasForeignKey("CellID")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Data_Visualisation.Models.MeasurementData", "MeasurementData")
                        .WithMany()
                        .HasForeignKey("MeasurementDataID");

                    b.HasOne("Data_Visualisation.Models.Stack", "Stack")
                        .WithMany("Measurements")
                        .HasForeignKey("StackID");
                });
        }
    }
}
