using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Data_Visualisation.Models;

namespace DataVisualisation.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20170527145437_Initial")]
    partial class Initial
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.2");

            modelBuilder.Entity("Data_Visualisation.Models.Record", b =>
                {
                    b.Property<int>("RecordID")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Category");

                    b.Property<string>("Description");

                    b.Property<string>("Name");

                    b.HasKey("RecordID");

                    b.ToTable("Records");
                });
        }
    }
}
