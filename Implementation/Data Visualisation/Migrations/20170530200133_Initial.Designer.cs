using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Data_Visualisation.Models;

namespace DataVisualisation.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20170530200133_Initial")]
    partial class Initial
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.2");

            modelBuilder.Entity("Data_Visualisation.Models.Record", b =>
                {
                    b.Property<int>("RecordId")
                        .ValueGeneratedOnAdd();

                    b.Property<byte[]>("BinaryData");

                    b.Property<string>("Category");

                    b.Property<DateTime>("Creation");

                    b.Property<string>("Description");

                    b.Property<DateTime>("Modification");

                    b.Property<string>("Name");

                    b.HasKey("RecordId");

                    b.ToTable("Records");
                });
        }
    }
}
