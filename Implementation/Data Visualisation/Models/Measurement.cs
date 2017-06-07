using System;
using System.Collections.Generic;

namespace Data_Visualisation.Models
{

    public enum MeasuementType
    {
        Undefined, TimeSeries, LocusCurve
    }

    public enum OperationMode
    {
        Undefined, Charge, Discharge
    }

    public class Measurement
    {
        public int MeasurementID { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public string Description { get; set; }
        public MeasuementType MeasurementType { get; set; }
        public MeasurementData MeasurementData { get; set; }
        public string FileName { get; set; }
        public string FileExtension { get; set; }
        public long FileSize { get; set; }
        public byte[] BinaryData { get; set; }
        public string ContentType { get; set; }
        public DateTime Creation { get; set; }
        public DateTime Modification { get; set; }

        public Stack Stack { get; set; }
        public Cell Cell { get; set; }
    }

    public class MeasurementData
    {
        public int MeasurementDataID { get; set; }
    }

    public class TimeSeries : MeasurementData
    {
        public string[] Headers { get; set; }
        public DateTime Time { get; set; }
        public double[][] Data { get; set; }
    }

    public class LocusCurve : MeasurementData
    {
        public DateTime Beginning { get; set; }
        public OperationMode Mode { get; set; }
        public float Current { get; set; }
        public float StateOfCharge { get; set; }
        public int[] Frequencies { get; set; }
        public double[][] Data { get; set; }
        public List<TimeSeries> RawData { get; set; }
    }

}