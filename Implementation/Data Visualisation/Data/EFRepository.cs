using System.Collections.Generic;
using System.Linq;

using Data_Visualisation.Models;

namespace Data_Visualisation.Data
{

    public class EFRepository : IRepository
    {
        private ApplicationDbContext Context;

        public EFRepository(ApplicationDbContext context)
        {
            Context = context;
        }

        public IEnumerable<Stack> Stacks => Context.Stacks;
        public IEnumerable<Cell> Cells => Context.Cells;
        public IEnumerable<Measurement> Measurements => Context.Measurements;

        public void SaveStack(Stack stack)
        {
            if (stack.StackID == 0)
            {
                Context.Stacks.Add(stack);
            }

            else
            {
                Stack dbEntry = Context.Stacks
                    .FirstOrDefault(p => p.StackID == stack.StackID);

                if (dbEntry != null)
                {
                    dbEntry.Name = stack.Name;
                    dbEntry.Category = stack.Category;
                    dbEntry.Description = stack.Description;
                    dbEntry.CellCount = stack.CellCount;
                    dbEntry.CircuitType = stack.CircuitType;
                    dbEntry.Creation = stack.Creation;
                    dbEntry.Modification = stack.Modification;

                    dbEntry.StackCells = stack.StackCells;
                    dbEntry.Measurements = stack.Measurements;
                }
            }

            Context.SaveChanges();
        }

        public Stack DeleteStack(int stackID)
        {
            Stack dbEntry = Context.Stacks
                .FirstOrDefault(p => p.StackID == stackID);

            if (dbEntry != null)
            {
                Context.Stacks.Remove(dbEntry);
                Context.SaveChanges();
            }

            return dbEntry;
        }

        public void SaveCell(Cell cell)
        {
            if (cell.CellID == 0)
            {
                Context.Cells.Add(cell);
            }

            else
            {
                Cell dbEntry = Context.Cells
                    .FirstOrDefault(p => p.CellID == cell.CellID);

                if (dbEntry != null)
                {
                    dbEntry.Name = cell.Name;
                    dbEntry.Category = cell.Category;
                    dbEntry.Description = cell.Description;
                    dbEntry.MeasurementCount = cell.MeasurementCount;
                    dbEntry.Creation = cell.Creation;
                    dbEntry.Modification = cell.Modification;

                    dbEntry.CellLabel = cell.CellLabel;

                    dbEntry.StackCells = cell.StackCells;
                    dbEntry.Measurements = cell.Measurements;
                }
            }

            Context.SaveChanges();
        }

        public Cell DeleteCell(int cellID)
        {
            Cell dbEntry = Context.Cells
                .FirstOrDefault(p => p.CellID == cellID);

            if (dbEntry != null)
            {
                Context.Cells.Remove(dbEntry);
                Context.SaveChanges();
            }

            return dbEntry;
        }

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