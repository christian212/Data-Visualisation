using System.Collections.Generic;

using Data_Visualisation.Models;

namespace Data_Visualisation.Data
{

    public interface ICellRepository
    {
        IEnumerable<Cell> Cells { get; }

        void SaveCell(Cell cell);
        Cell DeleteCell(int cellID);
    }

}