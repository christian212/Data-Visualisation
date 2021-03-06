﻿using AspCoreServer.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace AspCoreServer.Data
{

    // public class SpaIdentityDbContext : IdentityDbContext<AppUser, AppRole, int>
    // {
    //     public SpaIdentityDbContext(DbContextOptions<SpaIdentityDbContext> options)
    //         : base(options)
    //     {
    //     }

    //     protected override void OnModelCreating(ModelBuilder builder)
    //     {
    //         base.OnModelCreating(builder);
    //         // Customize the ASP.NET Identity model and override the defaults if needed.
    //         // For example, you can rename the ASP.NET Identity table names and more.
    //         // Add your customizations after calling base.OnModelCreating(builder);
    //     }
    // }

    public class SpaDbContext : IdentityDbContext<AppUser, AppRole, int>
    {
        public SpaDbContext(DbContextOptions<SpaDbContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        public DbSet<Battery> Batteries { get; set; }
        public DbSet<Stack> Stacks { get; set; }
        public DbSet<Cell> Cells { get; set; }
        public DbSet<Measurement> Measurements { get; set; }
        public DbSet<RawMeasurement> RawMeasurements { get; set; }

        public DbSet<JobSeeker> JobSeekers { get; set; }
        public DbSet<Admin> Admins { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Measurement>()
            .HasOne(p => p.Battery)
            .WithMany(b => b.Measurements)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Measurement>()
            .HasOne(p => p.Stack)
            .WithMany(b => b.Measurements)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Measurement>()
            .HasOne(p => p.Cell)
            .WithMany(b => b.Measurements)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<StackCell>()
                .HasKey(sc => new { sc.StackId, sc.CellId });

            modelBuilder.Entity<StackCell>()
                .HasOne(sc => sc.Stack)
                .WithMany(s => s.StackCells)
                .HasForeignKey(sc => sc.StackId);

            modelBuilder.Entity<StackCell>()
                .HasOne(sc => sc.Cell)
                .WithMany(s => s.StackCells)
                .HasForeignKey(sc => sc.CellId);


            modelBuilder.Entity<BatteryStack>()
            .HasKey(bs => new { bs.BatteryId, bs.StackId });

            modelBuilder.Entity<BatteryStack>()
                .HasOne(bs => bs.Battery)
                .WithMany(s => s.BatteryStacks)
                .HasForeignKey(bs => bs.BatteryId);

            modelBuilder.Entity<BatteryStack>()
                .HasOne(bs => bs.Stack)
                .WithMany(s => s.BatteryStacks)
                .HasForeignKey(bs => bs.StackId);

        }
    }
}
