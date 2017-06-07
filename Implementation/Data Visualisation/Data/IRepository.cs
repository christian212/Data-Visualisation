using System.Collections.Generic;

using Data_Visualisation.Models;

namespace Data_Visualisation.Data
{

    public interface IRepository
    {
        IEnumerable<Stack> Stacks { get; }
        IEnumerable<Cell> Cells { get; }
        IEnumerable<Measurement> Measurements { get; }

        void SaveStack(Stack stack);
        Stack DeleteStack(int stackID);

        void SaveCell(Cell cell);
        Cell DeleteCell(int cellID);

        void SaveMeasurement(Measurement measurement);
        Measurement DeleteMeasurement(int measurementID);
    }

}