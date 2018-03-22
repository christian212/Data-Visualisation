using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AspCoreServer.Models
{

    public class Stack
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int CellCount { get; set; }
        public CircuitType CircuitType { get; set; }

        public ICollection<BatteryStack> BatteryStacks { get; set; }
        public ICollection<StackCell> StackCells { get; set; }
        public ICollection<Measurement> Measurements { get; set; }

        public DateTime Created { get; set; }
        public DateTime Modified { get; set; }

        //Setting Default value
        public Stack()
        {
            Description = "Beschreibung";
            Created = DateTime.Now.ToUniversalTime();
            Modified = DateTime.Now.ToUniversalTime();
        }
    }

}