using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AspCoreServer.Models
{

    public enum MeasuementType
    {
        Undefined, TimeSeries, Locus
    }

    public enum OperationMode
    {
        Undefined, Charge, Discharge
    }

    public class Measurement
    {
        public int MeasurementID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public string FileName { get; set; }
        public long FileSize { get; set; }
        public MeasurementData MeasurementData { get; set; }

        public Battery Battery { get; set; }
        public Stack Stack { get; set; }
        [Required]
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
            Created = DateTime.Now;
            Modified = DateTime.Now;
        }
    }

    public class MeasurementData
    {
        public int MeasurementDataID { get; set; }
    }

    public class TimeSeries : MeasurementData
    {
        public DateTime Time { get; set; }
        public double[] Data { get; set; }
    }

    public class LocusCurve : MeasurementData
    {
        public DateTime Beginning { get; set; }
        public OperationMode Mode { get; set; }
        public float Current { get; set; }
        public float StateOfCharge { get; set; }
        public int[] Frequencies { get; set; }
        public double[] Data { get; set; }
        public List<TimeSeries> RawData { get; set; }
    }

}