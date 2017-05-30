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
                    new Record
                    {
                        Name = "Messung 1",
                        Category = "Zeitreihen",
                        Description = "Dies ist eine Beschreibung",

                    },
                    new Record
                    {
                        Name = "Messung Strom-Spannung",
                        Category = "Ortskurven",
                        Description = "Dies ist eine weitere Beschreibung"
                    },
                    new Record
                    {
                        Name = "Messung 17",
                        Category = "Zeitreihen",
                        Description = "Letzte Beschreibung"
                    },
                    new Record
                        {
                            Name = "Messung Impedanz",
                            Category = "Zeitreihen",
                            Description = "Dies ist eine Beschreibung"
                        },
                    new Record
                    {
                        Name = "Messung",
                        Category = "Ortskurven",
                        Description = "Dies ist eine weitere Beschreibung"
                    },
                    new Record
                    {
                        Name = "Messung 3",
                        Category = "Zeitreihen",
                        Description = "Letzte Beschreibung"
                    },
                    new Record
                    {
                        Name = "Messung 1",
                        Category = "Zeitreihen",
                        Description = "Dies ist eine Beschreibung"
                    },
                    new Record
                    {
                        Name = "Messung Strom-Spannung",
                        Category = "Ortskurven",
                        Description = "Dies ist eine weitere Beschreibung"
                    },
                    new Record
                    {
                        Name = "Messung 17",
                        Category = "Zeitreihen",
                        Description = "Letzte Beschreibung"
                    },
                    new Record
                        {
                            Name = "Messung Impedanz",
                            Category = "Zeitreihen",
                            Description = "Dies ist eine Beschreibung"
                        },
                    new Record
                    {
                        Name = "Messung",
                        Category = "Sonstige",
                        Description = "Dies ist eine weitere Beschreibung"
                    },
                    new Record
                    {
                        Name = "Messung 3",
                        Category = "Sonstige",
                        Description = "Letzte Beschreibung"
                    }
                );
                context.SaveChanges();
            }
        }
    }
}