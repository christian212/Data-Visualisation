using System;
using System.Collections.Generic;

using Data_Visualisation.Data;

namespace Data_Visualisation.Models
{

    public enum CircuitType
    {
        Undefined, Reihenschaltung, Parallelschaltung, Sonstige
    }

    public class Stack
    {
        public int StackID { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public string Description { get; set; }
        public int CellCount { get; set; }
        public CircuitType CircuitType { get; set; }
        public DateTime Creation { get; set; }
        public DateTime Modification { get; set; }

        public ICollection<StackCell> StackCells { get; set; }
        public ICollection<Measurement> Measurements { get; set; }
    }

}