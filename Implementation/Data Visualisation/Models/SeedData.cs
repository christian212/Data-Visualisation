using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Data_Visualisation.Models
{

    public static class SeedData
    {

        public static void EnsurePopulated(IApplicationBuilder app)
        {
            ApplicationDbContext context = app.ApplicationServices.GetRequiredService<ApplicationDbContext>();
            if (!context.Records.Any())
            {
                context.Records.AddRange(
                    new Record { 
                        Name = "Messung 1", Category = "Timeseries", Description = "Dies ist eine Beschreibung" },
                    new Record { 
                        Name = "Messung 2", Category = "Locus Curve", Description = "Dies ist eine weitere Beschreibung" },
                    new Record { 
                        Name = "Messung 3", Category = "Timeseries", Description = "Letzte Beschreibung" }
                );
                context.SaveChanges();
            }
        }
    }
}