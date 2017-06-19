using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AspCoreServer.Models
{

    public class StackCell
    {
        public int StackID { get; set; }
        public int CellID { get; set; }

        public Stack Stack { get; set; }
        public Cell Cell { get; set; }
    }
    
}