using System.Numerics;

namespace AspCoreServer.Models
{

    public class TimeSeriesFile
    {
        public MeasurementType MeasurementType { get; set; }
        public Row[] Data { set; get; }
    }

    public class Row
    {
        public long time { set; get; }
        public float voltage { set; get; }
        public float current { set; get; }
    }
}