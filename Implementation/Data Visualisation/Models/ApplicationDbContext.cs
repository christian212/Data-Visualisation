using Microsoft.EntityFrameworkCore;

namespace Data_Visualisation.Models
{

    public class ApplicationDbContext : DbContext
    {

        public DbSet<Record> Records { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Filename=./dataVisualisation.db");
        }
    }
}