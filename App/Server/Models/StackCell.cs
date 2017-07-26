using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AspCoreServer.Models
{

    public class StackCell
    {
        public int StackId { get; set; }
        public int CellId { get; set; }

        public Stack Stack { get; set; }
        public Cell Cell { get; set; }
    }
    
}