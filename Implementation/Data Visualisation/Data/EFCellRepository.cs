using System.Collections.Generic;
using System.Linq;

using Data_Visualisation.Models;

namespace Data_Visualisation.Data
{

    public class EFCellRepository : ICellRepository
    {
        private ApplicationDbContext Context;

        public EFCellRepository(ApplicationDbContext context)
        {
            Context = context;
        }

        public IEnumerable<Cell> Cells => Context.Cells;

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
    }

}