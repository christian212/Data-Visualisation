using AspCoreServer.Models;
using Microsoft.EntityFrameworkCore;

namespace AspCoreServer.Data
{
    public class SpaDbContext : DbContext
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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
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
