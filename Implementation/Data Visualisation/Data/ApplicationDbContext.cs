using Microsoft.EntityFrameworkCore;

using Data_Visualisation.Models;

namespace Data_Visualisation.Data
{

    public class ApplicationDbContext : DbContext
    {
        public DbSet<Stack> Stacks { get; set; }
        public DbSet<Cell> Cells { get; set; }
        public DbSet<Measurement> Measurements { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Filename=./dataVisualisation.db");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<StackCell>()
                .HasKey(sc => new { sc.StackID, sc.CellID });

            modelBuilder.Entity<StackCell>()
                .HasOne(sc => sc.Stack)
                .WithMany(s => s.StackCells)
                .HasForeignKey(sc => sc.StackID);

            modelBuilder.Entity<StackCell>()
                .HasOne(sc => sc.Cell)
                .WithMany(s => s.StackCells)
                .HasForeignKey(sc => sc.CellID);
        }
    }

}