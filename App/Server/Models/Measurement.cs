using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AspCoreServer.Models
{

    public enum MeasurementType
    {
        Undefined,
        Zeitreihe,
        Ortskurve,
        Sonstige
    }

    public class Measurement
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public string FileName { get; set; }
        public string FilePath { get; set; }
        public long FileSize { get; set; }
        public MeasurementType MeasurementType { get; set; }

        public Battery Battery { get; set; }
        public Stack Stack { get; set; }
        //[Required]
        public Cell Cell { get; set; }

        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        [DataType(DataType.Date)]
        public DateTime Created { get; set; }

        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        [DataType(DataType.Date)]
        public DateTime Modified { get; set; }

        //Setting Default value
        public Measurement()
        {
            Name = "Name";
            Description = "Beschreibung";
            Created = DateTime.Now.ToUniversalTime();
            Modified = DateTime.Now.ToUniversalTime();
        }
    }

}