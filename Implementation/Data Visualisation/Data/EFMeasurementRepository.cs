using System.Collections.Generic;
using System.Linq;

using Data_Visualisation.Models;

namespace Data_Visualisation.Data
{

    public class EFMeasurementRepository : IMeasurementRepository
    {
        private ApplicationDbContext Context;

        public EFMeasurementRepository(ApplicationDbContext context)
        {
            Context = context;
        }

        public IEnumerable<Measurement> Measurements => Context.Measurements;

        public void SaveMeasurement(Measurement measurement)
        {
            if (measurement.MeasurementID == 0)
            {
                Context.Measurements.Add(measurement);
            }

            else
            {
                Measurement dbEntry = Context.Measurements
                    .FirstOrDefault(p => p.MeasurementID == measurement.MeasurementID);

                if (dbEntry != null)
                {
                    dbEntry.Name = measurement.Name;
                    dbEntry.Category = measurement.Category;
                    dbEntry.Description = measurement.Description;
                    dbEntry.MeasurementType = measurement.MeasurementType;
                    dbEntry.MeasurementData = measurement.MeasurementData;
                    dbEntry.FileName = measurement.FileName;
                    dbEntry.FileExtension = measurement.FileExtension;
                    dbEntry.FileSize = measurement.FileSize;
                    dbEntry.BinaryData = measurement.BinaryData;
                    dbEntry.ContentType = measurement.ContentType;
                    dbEntry.Creation = measurement.Creation;
                    dbEntry.Modification = measurement.Modification;

                    dbEntry.Stack = measurement.Stack;
                    dbEntry.Cell = measurement.Cell;
                }
            }

            Context.SaveChanges();
        }

        public Measurement DeleteMeasurement(int measurementID)
        {
            Measurement dbEntry = Context.Measurements
                .FirstOrDefault(p => p.MeasurementID == measurementID);

            if (dbEntry != null)
            {
                Context.Measurements.Remove(dbEntry);
                Context.SaveChanges();
            }

            return dbEntry;
        }
    }

}