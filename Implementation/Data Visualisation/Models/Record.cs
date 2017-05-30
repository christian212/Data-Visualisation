using System;
using System.Collections.Generic;

namespace Data_Visualisation.Models
{

    public class Record
    {
        public int RecordId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public byte[] BinaryData { get; set; }
        public DateTime Creation { get; set; }
        public DateTime Modification { get; set; }
    }

}