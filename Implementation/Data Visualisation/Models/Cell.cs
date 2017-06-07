using System;
using System.Collections.Generic;

using Data_Visualisation.Data;

namespace Data_Visualisation.Models
{

    public class Cell
    {
        public int CellID { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public string Description { get; set; }
        public int MeasurementCount { get; set; }
        public DateTime Creation { get; set; }
        public DateTime Modification { get; set; }

        public string CellLabel { get; set; }

        public ICollection<Measurement> Measurements { get; set; }
        public ICollection<StackCell> StackCells { get; set; }
    }

}