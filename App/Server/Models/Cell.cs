using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AspCoreServer.Models
{

    public class Cell
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int MeasurementCount { get; set; }
        public string CellLabel { get; set; }

        public ICollection<StackCell> StackCells { get; set; }
        public ICollection<Measurement> Measurements { get; set; }

        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        [DataType(DataType.Date)]
        public DateTime Created { get; set; }

        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        [DataType(DataType.Date)]
        public DateTime Modified { get; set; }

        //Setting Default value
        public Cell()
        {   
            Name = "Name";
            Description = "Beschreibung";
            Created = DateTime.Now;
            Modified = DateTime.Now;
        }
    }

}